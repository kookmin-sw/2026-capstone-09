import { CAPTION_CONTAINER_SELECTORS } from '../utils/constants';

const DEBOUNCE_MS = 2000;

interface ActiveNodeEntry {
  timer: ReturnType<typeof setTimeout>;
  speaker: string;
}

export class CaptionObserver {
  private buffer: string[] = [];
  private observer: MutationObserver | null = null;
  // key: debounce 단위 노드 (text node 또는 caption 컨테이너 element)
  private activeNodes: Map<Node, ActiveNodeEntry> = new Map();

  start(): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          // in-place 수정 → text node 자체를 key
          this.scheduleCapture(mutation.target, mutation.target);
        } else if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((n) => this.captureOnRemove(n));
          mutation.addedNodes.forEach((n) => this.onNodeAdded(n));
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // 새 노드 추가 시: 부모 element를 key로 사용해서 같은 컨테이너 내 변경을 하나로 묶음
  private onNodeAdded(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent && (node.textContent?.trim().length ?? 0) > 0) {
        this.scheduleCapture(node, parent);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // 추가된 <span> 등의 직접 text 자식 → 해당 element의 부모를 key
      const parent = (node as Element).parentElement;
      if (!parent) return;
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE && (child.textContent?.trim().length ?? 0) > 0) {
          this.scheduleCapture(child, parent);
        }
      });
    }
  }

  // speakerRef: 화자 추출 기준 노드 (DOM 위치 파악)
  // captureKey: debounce + 텍스트 캡처 단위 (같은 key = 같은 debounce 타이머)
  // 캡션 컨테이너가 DOM에 존재할 때만, 해당 컨테이너 밖의 노드는 무시 (PiP UI 잡음 방지)
  private captionContainerExists(): boolean {
    return CAPTION_CONTAINER_SELECTORS.some((s) => !!document.querySelector(s));
  }

  private isInsideCaptionContainer(node: Node): boolean {
    let el: Element | null =
      node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
    while (el && el !== document.body) {
      if (CAPTION_CONTAINER_SELECTORS.some((s) => el!.matches(s))) return true;
      el = el.parentElement;
    }
    return false;
  }

  private scheduleCapture(speakerRef: Node, captureKey: Node): void {
    if (this.captionContainerExists() && !this.isInsideCaptionContainer(captureKey)) return;

    const existing = this.activeNodes.get(captureKey);
    if (existing) clearTimeout(existing.timer);

    let speaker = existing?.speaker ?? '';
    if (!existing) {
      try {
        speaker = this.extractSpeaker(speakerRef);
      } catch {
        // 화자 추출 실패는 무시 — 자막은 화자 없이 저장
      }
    }

    const timer = setTimeout(() => {
      const text = this.extractCleanText(captureKey);
      if (text) this.buffer.push(this.format(speaker, text));
      this.activeNodes.delete(captureKey);
    }, DEBOUNCE_MS);

    this.activeNodes.set(captureKey, { timer, speaker });
  }

  private captureOnRemove(removedNode: Node): void {
    this.activeNodes.forEach((entry, key) => {
      const isRemoved =
        removedNode === key ||
        (removedNode instanceof Element && removedNode.contains(key));

      if (isRemoved) {
        clearTimeout(entry.timer);
        const text = this.extractCleanText(key);
        if (text) this.buffer.push(this.format(entry.speaker, text));
        this.activeNodes.delete(key);
      }
    });
  }

  // DOM을 위로 순회하면서 "caption 컨테이너 바로 앞 형제 요소"에서 화자명 추출
  private extractSpeaker(node: Node): string {
    let el: Element | null =
      node.nodeType === Node.ELEMENT_NODE
        ? (node as Element)
        : node.parentElement;

    while (el && el !== document.body) {
      const children = Array.from(el.children);
      if (children.length >= 2) {
        const captionIdx = children.findIndex((child) => child.contains(node));
        if (captionIdx > 0) {
          const candidate = children[captionIdx - 1];
          const name = candidate.textContent?.trim() ?? '';
          if (name.length >= 1 && name.length <= 50 && !name.includes('\n')) {
            return name;
          }
        }
      }
      el = el.parentElement;
    }

    return '';
  }

  private extractCleanText(node: Node): string {
    const raw = node.textContent?.trim() ?? '';
    if (raw.length < 3 || raw.length > 400) return '';
    return raw;
  }

  private format(speaker: string, text: string): string {
    return speaker ? `${speaker}: ${text}` : text;
  }

  flush(): string[] {
    const captured = [...this.buffer];
    this.buffer = [];
    return captured;
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.activeNodes.forEach((entry) => clearTimeout(entry.timer));
    this.activeNodes.clear();
    this.buffer = [];
  }

  isActive(): boolean {
    return this.observer !== null;
  }
}