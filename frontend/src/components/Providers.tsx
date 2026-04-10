'use client';

import { ThemeProvider } from '@wanteddev/wds';
import { AppRouterCacheProvider } from '@wanteddev/wds-nextjs';

import '@wanteddev/wds/global.css';
import { ToastProvider } from './commons/toast/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default Providers;
