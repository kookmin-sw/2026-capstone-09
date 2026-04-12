'use client';

import { ThemeProvider } from '@wanteddev/wds';
import { AppRouterCacheProvider } from '@wanteddev/wds-nextjs';

import Modal from '@/components/commons/modal/Modal';
import { ModalProvider } from '@/components/commons/modal/ModalContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppRouterCacheProvider>
        <ModalProvider>
          {children}
          <Modal />
        </ModalProvider>
      </AppRouterCacheProvider>
    </ThemeProvider>
  );
}

export default Providers;
