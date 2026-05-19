import { CAPTION_TEXT_SELECTORS } from '../utils/constants';

export class CaptionObserver {
  private buffer: string[] = [];
  private observer: MutationObserver | null = null;
  private lastText = '';

  start(): void {
    this.observer = new MutationObserver(() => {
      this.extractCaptions();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private extractCaptions(): void {
    for (const selector of CAPTION_TEXT_SELECTORS) {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        const text = el.textContent?.trim();
        if (text && text.length > 1 && text !== this.lastText) {
          this.lastText = text;
          this.buffer.push(text);
        }
      });
    }
  }

  flush(): string[] {
    const captured = [...this.buffer];
    this.buffer = [];
    return captured;
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.buffer = [];
  }

  isActive(): boolean {
    return this.observer !== null;
  }
}