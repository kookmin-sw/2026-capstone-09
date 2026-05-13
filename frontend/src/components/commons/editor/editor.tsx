'use client';

import { useRef } from 'react';
import { Collaboration, isChangeOrigin } from '@tiptap/extension-collaboration';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown, type MarkdownStorage } from 'tiptap-markdown';
import type { XmlFragment } from 'yjs';

import { useYjsFragmentInit } from '@/hooks/useYjsFragmentInit';

const SAVE_DEBOUNCE_MS = 1000;

interface EditorProps {
  content: string | undefined;
  /** Yjs XmlFragment — 전달 시 협업 편집 활성화 */
  fragment?: XmlFragment | null;
  /** 로컬 변경 발생 후 디바운스 저장 콜백 */
  onUpdate?: (markdown: string) => void;
}

export default function Editor({ content, fragment, onUpdate }: EditorProps) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Markdown,
        Placeholder.configure({ placeholder: '내용을 입력하세요.' }),
        ...(fragment ? [Collaboration.configure({ fragment })] : []),
      ],
      content: fragment ? undefined : (content ?? ''),
      onUpdate({ editor: e, transaction }) {
        if (isChangeOrigin(transaction)) return;

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          const mdStorage = (e.storage as unknown as Record<string, unknown>).markdown as MarkdownStorage;
          onUpdateRef.current?.(mdStorage.getMarkdown());
        }, SAVE_DEBOUNCE_MS);
      },
      editorProps: {
        attributes: { class: 'prose focus:outline-none m-5 pb-40' },
      },
      immediatelyRender: false,
    },
    [fragment],
  );

  useYjsFragmentInit(editor, fragment ?? null, content);

  return (
    <div className="prose [&_.ProseMirror]:leading-[1.4] [&_.ProseMirror_p]:my-0">
      <EditorContent editor={editor} />
    </div>
  );
}
