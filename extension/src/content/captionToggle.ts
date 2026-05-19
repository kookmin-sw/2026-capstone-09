import { CAPTION_CONTAINER_SELECTORS, CC_BUTTON_SELECTORS } from '../utils/constants';

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