'use client';

import { useEffect, useRef, useState } from 'react';

import { useYjsContext } from '@/contexts/YjsContext';

export function useYjsArray<T extends object>(
  fieldName: string,
  initial: T[] | undefined,
  dedupeKey: keyof T,
) {
  const yjsCtx = useYjsContext();
  const [items, setItems] = useState<T[]>(initial ?? []);
  const initializedRef = useRef(false);

  useEffect(() => {
    initializedRef.current = false;
    if (!yjsCtx) {
      setItems(initial ?? []);
      return;
    }

    const arr = yjsCtx.ydoc.getArray<T>(fieldName);
    // observer는 변경 이벤트만 감지하므로, 이미 데이터가 있는 경우 초기 상태를 직접 동기화
    if (arr.length > 0) {
      setItems(dedupe(arr.toArray(), dedupeKey));
    }
    const observer = () => setItems(dedupe(arr.toArray(), dedupeKey));
    arr.observe(observer);
    return () => arr.unobserve(observer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yjsCtx]);

  useEffect(() => {
    if (!yjsCtx || initial === undefined || initializedRef.current) return;

    const { ydoc, provider } = yjsCtx;
    const arr = ydoc.getArray<T>(fieldName);

    const doInit = () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      if (arr.length === 0 && initial.length > 0) {
        ydoc.transact(() => arr.insert(0, initial));
      } else {
        setItems(dedupe(arr.toArray(), dedupeKey));
      }
    };

    if (provider.synced) {
      doInit();
      return;
    }

    const handleSync = (synced: boolean) => {
      if (synced) doInit();
    };
    provider.on('sync', handleSync);
    return () => provider.off('sync', handleSync);
  }, [yjsCtx, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  const yAdd = (item: T) => {
    if (!yjsCtx) {
      setItems((prev) => [...prev, item]);
      return;
    }
    yjsCtx.ydoc.getArray<T>(fieldName).push([item]);
  };

  const yRemove = (key: T[keyof T]) => {
    if (!yjsCtx) {
      setItems((prev) => prev.filter((i) => i[dedupeKey] !== key));
      return;
    }
    const arr = yjsCtx.ydoc.getArray<T>(fieldName);
    const idx = arr.toArray().findIndex((i) => i[dedupeKey] === key);
    if (idx !== -1) arr.delete(idx, 1);
  };

  return { items, yAdd, yRemove };
}

function dedupe<T extends object>(items: T[], key: keyof T): T[] {
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const val = item[key];
    if (val == null || seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}
