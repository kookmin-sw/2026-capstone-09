import { useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ToastPlacement } from './toast.types';
import { toastStore } from './toastStore';

type Variant = 'normal' | 'positive' | 'cautionary' | 'negative';

interface ToastOptions {
  id?: string;
  content: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  duration?: number | 'short' | 'long';
  onAnimationEnd?: (type: 'show' | 'hide') => void;
  placement?: ToastPlacement;
}

// id값 생성
let toastCount = 0;
function generateId() {
  return `toast-${++toastCount}`;
}

export function usePositionedToast() {
  return useCallback(({ id, placement, ...options }: ToastOptions) => {
    toastStore.add({
      id: id ?? generateId(),
      placement: placement ?? 'bottom-center',
      ...options,
    });
  }, []);
}
