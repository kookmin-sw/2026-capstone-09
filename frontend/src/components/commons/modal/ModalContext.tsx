'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * 모달의 시각적 형태를 결정하는 타입입니다.
 * - `default`: 표준 중앙 모달
 * - `compact`: 좁은 여백을 가진 모달 (주로 검색창 등에 사용)
 * - `sidebar`: 좌측에서 나타나는 설정/메뉴용 모달
 */
export type ModalVariant =
  | 'default' // 기본 모달
  | 'compact' // 좌우 36px / 상하 24px (초기 기준 검색 모달)
  | 'sidebar' // 좌측 사이드바(설정) 모달
  | 'small'; // 소형 확인/삭제 다이얼로그

/**
 * 모달을 열 때 사용할 수 있는 옵션들입니다.
 */
export interface ModalOptions {
  /** 모달의 디자인 스타일 (기본값: 'default') */
  variant?: ModalVariant;
  /** 백드롭(배경) 클릭 시 모달을 닫을지 여부 (기본값: false) */
  closeOnBackdrop?: boolean;
  /** ESC 키를 눌렀을 때 모달을 닫을지 여부 (기본값: false) */
  closeOnEsc?: boolean;
  /** `variant="sidebar"`일 때 표시할 사이드바 전용 영역 */
  sidebar?: ReactNode;
  /** 모달 본문에 렌더링할 내용 */
  content: ReactNode;
}

interface ModalState extends ModalOptions {
  isOpen: boolean;
}

interface ModalContextValue {
  state: ModalState;
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const defaultState: ModalState = {
  isOpen: false,
  content: null,
  variant: 'default',
  closeOnBackdrop: false,
  closeOnEsc: false,
};

const ModalContext = createContext<ModalContextValue>({
  state: { isOpen: false, content: null },
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>(defaultState);

  const openModal = useCallback((options: ModalOptions) => {
    setState({
      ...defaultState,
      ...options,
      isOpen: true,
    });
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ModalContext.Provider value={{ state, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

/**
 * 모달 제어를 위한 커스텀 훅입니다.
 * @returns {ModalContextValue} openModal, closeModal 함수 및 state 객체
 *
 * useModal의 parmas
 * @params variant?: ModalVariant; - 모달의 디자인 스타일
 * @params closeOnBackdrop?: boolean; - 배경 클릭 시 모달을 닫을지 여부
 * @parmas closeOnEsc?: boolean; - ESC 키를 눌렀을 때 모달을 닫을지 여부
 * @parmas sidebar?: ReactNode; - 사이드바 전용 영역
 * @params conent: ReactNode; - 모달 본문에 렌더링할 내용
 */
export function useModal() {
  return useContext(ModalContext);
}
