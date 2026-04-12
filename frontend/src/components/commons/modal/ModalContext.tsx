"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";


export type ModalVariant =
  | "default"   // 기본 모달
  | "compact"   // 좌우 36px / 상하 24px (초기 기준 검색 모달)
  | "sidebar";  // 좌측 사이드바(설정) 모달

export interface ModalOptions {
  variant?: ModalVariant;
  closeOnBackdrop?: boolean; // 백드롭 클릭 시 닫기 여부 (기본: false)
  closeOnEsc?: boolean; // ESC 키 닫기 여부 (기본: false) 
  title?: ReactNode;
  sidebar?: ReactNode;  // 사이드바 영역 (variant="sidebar" 일 때 사용)
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
  variant: "default",
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

export function useModal() {
  return useContext(ModalContext);
}