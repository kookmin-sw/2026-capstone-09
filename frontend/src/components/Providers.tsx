'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@wanteddev/wds';
import { AppRouterCacheProvider } from '@wanteddev/wds-nextjs';

import Modal from '@/components/commons/modal/Modal';
import { ModalProvider } from '@/components/commons/modal/ModalContext';
import Dialog from './commons/custom-dialog/Dialog';
import { DialogProvider } from './commons/custom-dialog/DialogContext';
import { ToastProvider } from './commons/custom-toast/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
