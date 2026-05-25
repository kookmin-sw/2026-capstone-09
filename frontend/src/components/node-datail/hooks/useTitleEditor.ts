'use client';

import { Extension } from '@tiptap/core';
import { Collaboration } from '@tiptap/extension-collaboration';
import { Placeholder } from '@tiptap/extensions';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';

import { YJS_FIELDS, useYjsContext } from '@/contexts/YjsContext';
import { useYjsFragmentInit } from '@/hooks/useYjsFragmentInit';
import { stripNewlinesPaste } from '@/utils/tiptapPaste';

export function useTitleEditor(title: string | undefined, onSave: (value: string) => void) {
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const yjsCtx = useYjsContext();
  const fragment = yjsCtx?.ydoc.getXmlFragment(YJS_FIELDS.title) ?? null;

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Placeholder.configure({ placeholder: '제목을 입력하세요.' }),
        Extension.create({
          name: 'titleKeyboardShortcuts',
          addKeyboardShortcuts() {
            return {
              Enter: ({ editor: e }) => { e.view.dom.blur(); return true; },
              Escape: ({ editor: e }) => { e.view.dom.blur(); return true; },
            };
          },
        }),
        ...(fragment ? [Collaboration.configure({ fragment })] : []),
      ],
      content: fragment ? undefined : (title ?? '새 노드'),
      onBlur({ editor: e }) {
        onSaveRef.current(e.getText());
      },
      editorProps: {
        handlePaste: stripNewlinesPaste,
        attributes: { class: 'prose focus:outline-none text-2xl font-medium' },
      },
      immediatelyRender: false,
    },
    [fragment],
  );

  useYjsFragmentInit(editor, fragment, title);

  return editor;
}
