import { CaptionObserver } from './captionObserver';
import { ensureCaptionsEnabled } from './captionToggle';
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

async function startCapture(): Promise<void> {
  const status = (await sendMessage({ type: 'GET_STATUS' })) as StatusResponse;

  // meetingContext가 설정되지 않으면 대기
  if (!status.meetingContext) return;

  // 이미 수집 중이면 중복 시작 방지
  if (captionObserver?.isActive()) return;

  // 자막이 꺼져 있으면 자동으로 켜기
  await ensureCaptionsEnabled();

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
  // 남은 자막 최종 전송
  if (captionObserver) {
    const captions = captionObserver.flush();
    if (captions.length > 0) {
      await sendMessage({ type: 'CAPTIONS_CAPTURED', captions });
    }
    captionObserver.stop();
    captionObserver = null;
  }

  if (flushInterval) {
    clearInterval(flushInterval);
    flushInterval = null;
  }

  meetingMonitor?.stop();
  meetingMonitor = null;

  await sendMessage({ type: 'MEETING_ENDED' });
}

// storage 변경 감지: meetingContext가 set되면 수집 시작
chrome.storage.onChanged.addListener((changes) => {
  if (changes.meetingContext?.newValue && changes.isCapturing?.newValue) {
    startCapture().catch(console.error);
  }
});

// 페이지 로드 시 이미 캡처 중인 상태라면 재개
startCapture().catch(console.error);