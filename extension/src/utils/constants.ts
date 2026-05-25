export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// 30초마다 자막 전송
export const CAPTION_SEND_INTERVAL_MINUTES = 0.5;
export const ALARM_NAME = 'flowmeet-send-captions';

// content script에서 background로 플러시하는 주기 (ms)
export const FLUSH_INTERVAL_MS = 15_000;

// Google Meet 자막 텍스트 셀렉터 (Meet 버전에 따라 변경될 수 있음 - 여러 개 fallback)
export const CAPTION_TEXT_SELECTORS = [
  '[jsname="tgaKEf"]',
  '.a4cQT',
  '[data-start-time] span',
  '.CNusmb span',
];

// 자막 컨테이너가 DOM에 존재하면 자막이 켜진 상태
export const CAPTION_CONTAINER_SELECTORS = [
  '[jsname="YSxPC"]',
  '.iOzk7',
  '[class*="captions-container"]',
];

// 자막 켜기 버튼 셀렉터
export const CC_BUTTON_SELECTORS = [
  '[data-tooltip*="자막 켜기"]',
  '[data-tooltip*="Turn on captions"]',
  '[aria-label*="자막 켜기"]',
  '[aria-label*="Turn on captions"]',
];

// 자막 언어 선택 버튼 셀렉터 (자막 활성화 후 나타나는 언어 선택 UI)
export const CAPTION_LANG_BUTTON_SELECTORS = [
  '[aria-label*="자막 언어"]',
  '[aria-label*="Caption language"]',
  '[data-tooltip*="자막 언어"]',
  '[data-tooltip*="Caption language"]',
];

// 한국어 옵션 셀렉터 (언어 선택 메뉴 내부)
export const KOREAN_LANG_OPTION_SELECTORS = [
  '[data-value="ko-KR"]',
  '[data-value="ko"]',
  'li[role="option"]:has(*[lang="ko"])',
];

// 회의 종료 감지 셀렉터
export const MEETING_END_SELECTORS = [
  '[jsname="r4nke"]',
  '[data-call-ended]',
  '[aria-label*="회의에서 나갔습니다"]',
  '[aria-label*="You left the call"]',
];