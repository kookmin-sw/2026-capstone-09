'use client';

import { useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import type { XmlFragment } from 'yjs';

/** Yjs fragment가 비어 있을 때만 API 데이터로 1회 초기화 */
export function useYjsFragmentInit(
  editor: Editor | null,
  fragment: XmlFragment | null,
  content: string | undefined,
) {
  useEffect(() => {
    if (!editor || !fragment || !content) return;
    if (fragment.length === 0) {
      editor.commands.setContent(content);
    }
  }, [editor, fragment, content]);
}
