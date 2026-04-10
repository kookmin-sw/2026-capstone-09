'use client';

import { Toast, type ToastProps } from '@wanteddev/wds';
import type { ToastPlacement } from './toast.types';
import { getOrCreateContainer } from './toastContainerMap';

interface PositionedToastProps extends ToastProps {
  placement?: ToastPlacement;
}

export function PositionedToast({ placement = 'bottom-center', ...props }: PositionedToastProps) {
  const container = typeof window !== 'undefined' ? getOrCreateContainer(placement) : undefined;

  return <Toast container={container} {...props} />;
}
