import { useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ToastPlacement, Variant } from './toast.types';
import { toastStore } from './toastStore';

interface ToastOptions {
  /** 토스트의 고유 ID (미지정 시 자동 생성) */
  id?: string;
  /** 토스트에 표시할 내용 (텍스트 또는 React 노드) */
  content: ReactNode;
  /** 토스트의 스타일 변형 */
  variant?: Variant;
  /** 표시할 아이콘 노드 */
  icon?: ReactNode;
  /** * 토스트 유지 시간
   * @default 'short'
   */
  duration?: number | 'short' | 'long';
  /** 애니메이션이 끝났을 때 실행될 콜백 */
  onAnimationEnd?: (type: 'show' | 'hide') => void;
  /** * 토스트가 표시될 위치
   * @default 'bottom-center'
   */
  placement?: ToastPlacement;
}

let toastCount = 0;
function generateId() {
  return `toast-${++toastCount}`;
}

/**
 * 명령형(Imperative) 방식으로 특정 위치에 토스트를 호출할 수 있는 기능을 제공합니다.
 * * @example
 * const toast = usePositionedToast();
 * toast({ content: '성공했습니다!', variant: 'normal', placement: 'top-right' });
 * * @returns {Function} 토스트 실행 함수
 */
export function usePositionedToast() {
  return useCallback(({ id, placement, ...options }: ToastOptions) => {
    toastStore.add({
      id: id ?? generateId(),
      placement: placement ?? 'bottom-center',
      ...options,
    });
  }, []);
}
