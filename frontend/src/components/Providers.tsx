'use client';

import { ThemeProvider } from '@wanteddev/wds';
import { AppRouterCacheProvider } from '@wanteddev/wds-nextjs';

import Modal from '@/components/commons/modal/Modal';
import { ModalProvider } from '@/components/commons/modal/ModalContext';
import Dialog from './commons/custom-dialog/Dialog';
import { DialogProvider } from './commons/custom-dialog/DialogContext';
import { ToastProvider } from './commons/custom-toast/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppRouterCacheProvider>
        <ToastProvider>
          <ModalProvider>
            <DialogProvider>
              {children}
              <Modal />
              <Dialog />
            </DialogProvider>
          </ModalProvider>
        </ToastProvider>
      </AppRouterCacheProvider>
    </ThemeProvider>
  );
}

export default Providers;
