'use client';

import { Toast, type ToastProps } from '@wanteddev/wds';
import type { ToastPlacement } from './toast.types';
import { getOrCreateContainer } from './toastContainerMap';

interface PositionedToastProps extends ToastProps {
  placement?: ToastPlacement;
}

/**
 * 선언적 방식으로 토스트를 표시할 때 사용합니다.
 * `placement` 속성에 따라 적절한 위치의 컨테이너 안에 자동으로 렌더링됩니다.
 * * @example
 * <PositionedToast open={open} onOpenChange={setOpen} placement="top-right">
 * <ToastContainer>...</ToastContainer>
 * </PositionedToast>
 */
export function PositionedToast({ placement = 'bottom-center', ...props }: PositionedToastProps) {
  const container = typeof window !== 'undefined' ? getOrCreateContainer(placement) : undefined;

  return <Toast container={container} {...props} />;
}
