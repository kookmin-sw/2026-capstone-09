import { MEETING_END_SELECTORS } from '../utils/constants';

export class MeetingMonitor {
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private readonly initialPath: string;
  private endCallback: (() => void) | null = null;

  constructor() {
    this.initialPath = location.pathname;
  }

  onEnd(callback: () => void): void {
    this.endCallback = callback;

    this.checkInterval = setInterval(() => {
      const pathChanged = !location.pathname.startsWith(this.initialPath);
      const endScreenVisible = MEETING_END_SELECTORS.some(
        (selector) => !!document.querySelector(selector),
      );

      if (pathChanged || endScreenVisible) {
        this.triggerEnd();
      }
    }, 2000);

    window.addEventListener('beforeunload', () => this.triggerEnd(), { once: true });
  }

  private triggerEnd(): void {
    this.stop();
    this.endCallback?.();
    this.endCallback = null;
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}