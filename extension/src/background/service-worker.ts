import { appendTranscript } from '../api/captionApi';
import { endMeeting } from '../api/meetingApi';
import { storage } from '../utils/storage';
import { ALARM_NAME, CAPTION_SEND_INTERVAL_MINUTES } from '../utils/constants';
import type { Message, StatusResponse } from '../types';

chrome.alarms.create(ALARM_NAME, {
  periodInMinutes: CAPTION_SEND_INTERVAL_MINUTES,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    flushCaptions().catch(console.error);
  }
});

async function flushCaptions(): Promise<void> {
  const { pendingCaptions, meetingContext, isCapturing } = await storage.get([
    'pendingCaptions',
    'meetingContext',
    'isCapturing',
  ]);

  if (!isCapturing || !pendingCaptions?.length || !meetingContext) return;

  const content = pendingCaptions.join('\n');
  const { projectId, nodeId, meetingId } = meetingContext;

  try {
    await appendTranscript(projectId, nodeId, meetingId, content);
    await storage.set({
      pendingCaptions: [],
      lastSentAt: Date.now(),
    });
  } catch (err) {
    console.error('[FlowMeet] 자막 전송 실패:', err);
  }
}

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    handleMessage(message)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: String(err) }));
    return true; // 비동기 응답을 위해 true 반환
  },
);

async function handleMessage(message: Message): Promise<unknown> {
  switch (message.type) {
    case 'CAPTIONS_CAPTURED': {
      const { pendingCaptions = [], captionCount = 0, isCapturing } = await storage.get([
        'pendingCaptions',
        'captionCount',
        'isCapturing',
      ]);
      // 수집 중지 후 도착한 자막은 무시 (MEETING_ENDED 직후 race condition 방지)
      if (!isCapturing) return { ok: true };
      await storage.set({
        pendingCaptions: [...pendingCaptions, ...message.captions],
        captionCount: captionCount + message.captions.length,
      });
      return { ok: true };
    }

    case 'MEETING_STARTED': {
      await storage.set({ isCapturing: true });
      return { ok: true };
    }

    case 'MEETING_ENDED': {
      await flushCaptions();
      const { meetingContext } = await storage.get(['meetingContext']);
      if (meetingContext) {
        const { projectId, nodeId, meetingId } = meetingContext;
        await endMeeting(projectId, nodeId, meetingId).catch(console.error);
      }
      await storage.set({
        isCapturing: false,
        pendingCaptions: [],
        meetingContext: undefined,
        captionCount: 0,
      });
      return { ok: true };
    }

    case 'SET_MEETING_CONTEXT': {
      await storage.set({ meetingContext: message.context });
      return { ok: true };
    }

    case 'START_CAPTURE': {
      await storage.set({ isCapturing: true, pendingCaptions: [], captionCount: 0 });
      return { ok: true };
    }

    case 'STOP_CAPTURE': {
      await flushCaptions();
      await storage.set({ isCapturing: false });
      return { ok: true };
    }

    case 'ABORT_CAPTURE': {
      // 자막 전송 없이 즉시 중단 — pendingCaptions 버림
      await storage.set({ isCapturing: false, pendingCaptions: [], captionCount: 0 });
      return { ok: true };
    }

    case 'GET_STATUS': {
      const data = await storage.get([
        'isCapturing',
        'captionCount',
        'pendingCaptions',
        'lastSentAt',
        'meetingContext',
        'user',
      ]);
      const status: StatusResponse = {
        isCapturing: data.isCapturing ?? false,
        captionCount: data.captionCount ?? 0,
        pendingCount: data.pendingCaptions?.length ?? 0,
        lastSentAt: data.lastSentAt ?? null,
        meetingContext: data.meetingContext ?? null,
        user: data.user ?? null,
      };
      return status;
    }

    case 'SYNC_TOKENS': {
      if (message.accessToken && message.refreshToken) {
        await storage.set({
          accessToken: message.accessToken,
          refreshToken: message.refreshToken,
        });
      } else {
        // 토큰이 없으면 (로그아웃) extension storage도 초기화
        await storage.clear();
      }
      return { ok: true };
    }

    case 'LOGOUT': {
      await storage.clear();
      return { ok: true };
    }

    default:
      return { error: 'Unknown message type' };
  }
}
