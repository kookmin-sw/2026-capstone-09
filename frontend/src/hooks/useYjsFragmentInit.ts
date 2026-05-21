'use client';

import type { Editor } from '@tiptap/react';
import { useEffect } from 'react';
import type { XmlFragment } from 'yjs';

import { useYjsContext } from '@/contexts/YjsContext';

/** Yjs fragment가 비어 있을 때만 API 데이터로 1회 초기화.
 *  WebSocket sync 완료 후 체크하여 동시 접속 시 이중 삽입을 방지한다. */
export function useYjsFragmentInit(
  editor: Editor | null,
  fragment: XmlFragment | null,
  content: string | undefined,
) {
  const yjsCtx = useYjsContext();
  const provider = yjsCtx?.provider ?? null;

  useEffect(() => {
    if (!editor || !fragment || !content || !provider) return;

    const init = () => {
      if (fragment.length === 0) {
        editor.commands.setContent(content);
      }
    };

    if (provider.synced) {
      init();
      return;
    }

    const fallbackTimer = window.setTimeout(init, 120);

    const handleSync = (isSynced: boolean) => {
      if (isSynced) {
        window.clearTimeout(fallbackTimer);
        init();
        provider.off('sync', handleSync);
      }
    };
    provider.on('sync', handleSync);
    return () => {
      window.clearTimeout(fallbackTimer);
      provider.off('sync', handleSync);
    };
  }, [editor, fragment, content, provider]);
}
