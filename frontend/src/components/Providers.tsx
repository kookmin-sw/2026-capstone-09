'use client';

import { ThemeProvider } from '@wanteddev/wds';
import { AppRouterCacheProvider } from '@wanteddev/wds-nextjs';

import Modal from '@/components/commons/modal/Modal';
import { ModalProvider } from '@/components/commons/modal/ModalContext';
import { ToastProvider } from './commons/toast/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppRouterCacheProvider>
        <ToastProvider>
          <ModalProvider>
            {children}
            <Modal />
          </ModalProvider>
        </ToastProvider>
      </AppRouterCacheProvider>
    </ThemeProvider>
  );
}

export default Providers;
