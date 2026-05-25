import {
  CAPTION_CONTAINER_SELECTORS,
  CC_BUTTON_SELECTORS,
  CAPTION_LANG_BUTTON_SELECTORS,
  KOREAN_LANG_OPTION_SELECTORS,
} from '../utils/constants';

export function isCaptionEnabled(): boolean {
  return CAPTION_CONTAINER_SELECTORS.some((selector) => !!document.querySelector(selector));
}

function tryClickCaptionButton(): boolean {
  for (const selector of CC_BUTTON_SELECTORS) {
    const btn = document.querySelector<HTMLElement>(selector);
    if (btn) {
      btn.click();
      return true;
    }
  }
  return false;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ensureCaptionsEnabled(retries = 5, delayMs = 1200): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    if (isCaptionEnabled()) return true;
    tryClickCaptionButton();
    await wait(delayMs);
  }
  return isCaptionEnabled();
}

// 자막 언어를 한국어로 변경 시도 (실패 시 무시)
export async function trySetKoreanLanguage(): Promise<void> {
  await wait(1500); // 자막 활성화 후 언어 버튼이 나타날 때까지 대기

  for (let i = 0; i < 3; i++) {
    for (const selector of CAPTION_LANG_BUTTON_SELECTORS) {
      const btn = document.querySelector<HTMLElement>(selector);
      if (btn) {
        btn.click();
        await wait(500);
        for (const koSelector of KOREAN_LANG_OPTION_SELECTORS) {
          const option = document.querySelector<HTMLElement>(koSelector);
          if (option) {
            option.click();
            return;
          }
        }
        // 메뉴가 열렸지만 한국어 옵션 없음 — 닫기
        btn.click();
        return;
      }
    }
    await wait(1000);
  }
}