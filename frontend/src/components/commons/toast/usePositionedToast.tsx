import { useCallback, useId } from 'react';
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

export function usePositionedToast(defaultPlacement: ToastPlacement = 'bottom-center') {
  const defaultId = useId();

  return useCallback(
    ({ id, placement, ...options }: ToastOptions) => {
      toastStore.add({
        id: id ?? defaultId,
        placement: placement ?? defaultPlacement,
        ...options,
      });
    },
    [defaultId, defaultPlacement],
  );
}
