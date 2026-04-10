import type { ReactNode } from 'react';
import type { ToastPlacement } from './toast.types';

type Variant = 'normal' | 'positive' | 'cautionary' | 'negative';

export interface ToastItem {
  id: string;
  content: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  duration?: number | 'short' | 'long';
  onAnimationEnd?: (type: 'show' | 'hide') => void;
  placement: ToastPlacement;
}

type Listener = () => void;

let items: ToastItem[] = [];
const listeners = new Set<Listener>();

const EMPTY: ToastItem[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export const toastStore = {
  add(item: ToastItem) {
    items = [...items, item];
    notify();
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    notify();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): ToastItem[] {
    return items;
  },
  getServerSnapshot(): ToastItem[] {
    return EMPTY;
  },
};
