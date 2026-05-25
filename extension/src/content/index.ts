import { CaptionObserver } from './captionObserver';
import { ensureCaptionsEnabled, trySetKoreanLanguage } from './captionToggle';
import { MeetingMonitor } from './meetingMonitor';
import { FLUSH_INTERVAL_MS } from '../utils/constants';
import type { Message, StatusResponse } from '../types';

let captionObserver: CaptionObserver | null = null;
let meetingMonitor: MeetingMonitor | null = null;
let flushInterval: ReturnType<typeof setInterval> | null = null;

async function sendMessage(message: Message): Promise<unknown> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

function stopCapture(): void {
  captionObserver?.stop();
  captionObserver = null;
  if (flushInterval) {
    clearInterval(flushInterval);
    flushInterval = null;
  }
  meetingMonitor?.stop();
  meetingMonitor = null;
}

async function startCapture(): Promise<void> {
  const status = (await sendMessage({ type: 'GET_STATUS' })) as StatusResponse;

  // 두 값이 모두 설정된 후에만 시작
  if (!status.meetingContext || !status.isCapturing) return;

  // 이미 수집 중이면 중복 시작 방지
  if (captionObserver?.isActive()) return;

  // 자막이 꺼져 있으면 자동으로 켜고, 가능하면 한국어로 전환
  await ensureCaptionsEnabled();
  trySetKoreanLanguage().catch(() => {});

  captionObserver = new CaptionObserver();
  captionObserver.start();

  meetingMonitor = new MeetingMonitor();
  meetingMonitor.onEnd(handleMeetingEnd);

  // 주기적으로 수집된 자막을 background로 전달
  flushInterval = setInterval(async () => {
    if (!captionObserver) return;
    const captions = captionObserver.flush();
    if (captions.length > 0) {
      await sendMessage({ type: 'CAPTIONS_CAPTURED', captions });
    }
  }, FLUSH_INTERVAL_MS);

  await sendMessage({ type: 'MEETING_STARTED' });
}

async function handleMeetingEnd(): Promise<void> {
  // 남은 자막 최종 전송 후 중지 (service-worker가 MEETING_ENDED로 API 호출)
  if (captionObserver) {
    const captions = captionObserver.flush();
    if (captions.length > 0) {
      await sendMessage({ type: 'CAPTIONS_CAPTURED', captions });
    }
  }
  stopCapture();
  await sendMessage({ type: 'MEETING_ENDED' });
}

chrome.storage.onChanged.addListener((changes) => {
  // meetingContext 또는 isCapturing 중 하나라도 바뀌면 시작 재시도
  if (changes.meetingContext?.newValue || changes.isCapturing?.newValue) {
    startCapture().catch(console.error);
  }
  // 팝업/background에서 isCapturing=false로 설정 시 (회의 종료·중단) content script도 중지
  if (changes.isCapturing?.newValue === false) {
    stopCapture();
  }
});

// 페이지 로드 시 이미 캡처 중인 상태라면 재개
startCapture().catch(console.error);