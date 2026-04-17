'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * 다이얼로그를 열 때 사용할 수 있는 옵션들입니다.
 */
export interface DialogOptions {
  /** 백드롭(배경) 클릭 시 다이얼로그를 닫을지 여부 (기본값: false) */
  closeOnBackdrop?: boolean;
  /** ESC 키를 눌렀을 때 다이얼로그를 닫을지 여부 (기본값: false) */
  closeOnEsc?: boolean;
  /** 다이얼로그 본문에 렌더링할 내용 */
  content: ReactNode;
}

interface DialogState extends DialogOptions {
  isOpen: boolean;
}

interface DialogContextValue {
  state: DialogState;
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

const defaultState: DialogState = {
  isOpen: false,
  content: null,
  closeOnBackdrop: false,
  closeOnEsc: false,
};

const DialogContext = createContext<DialogContextValue>({
  state: { isOpen: false, content: null },
  openDialog: () => {},
  closeDialog: () => {},
});

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>(defaultState);

  const openDialog = useCallback((options: DialogOptions) => {
    setState({
      ...defaultState,
      ...options,
      isOpen: true,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <DialogContext.Provider value={{ state, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
}

/**
 * 다이얼로그 제어를 위한 커스텀 훅입니다.
 * @returns {DialogContextValue} openDialog, closeDialog 함수 및 state 객체
 *
 * useDialog의 parmas
 * @params closeOnBackdrop?: boolean; - 배경 클릭 시 다이얼로그를 닫을지 여부
 * @parmas closeOnEsc?: boolean; - ESC 키를 눌렀을 때 다이얼로그를 닫을지 여부
 * @params conent: ReactNode; - 다이얼로그 본문에 렌더링할 내용
 */
export function useDialog() {
  return useContext(DialogContext);
}
