'use client';

import { useCallback } from 'react';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';

export function useErrorToast() {
  const toast = usePositionedToast();

  return useCallback(
    (err: unknown, fallback: string) => {
      const message = (err as { error?: { message?: string } })?.error?.message ?? fallback;
      toast({ content: message, variant: 'negative', placement: 'top-center' });
    },
    [toast],
  );
}
