'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@wanteddev/wds';
import { AppRouterCacheProvider } from '@wanteddev/wds-nextjs';
import { useState } from 'react';

import Modal from '@/components/commons/modal/Modal';
import { ModalProvider } from '@/components/commons/modal/ModalContext';
import { AuthProvider } from '@/contexts/AuthContext';
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
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default Providers;
