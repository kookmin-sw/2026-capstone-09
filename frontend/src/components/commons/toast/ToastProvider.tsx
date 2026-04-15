'use client';

import { ToastRenderer } from './ToastRenderer';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastRenderer />
    </>
  );
}
