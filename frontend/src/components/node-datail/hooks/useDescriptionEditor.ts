'use client';

import { useEffect, useRef } from 'react';
import { Collaboration } from '@tiptap/extension-collaboration';
import { Extension } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { YJS_FIELDS, useYjsContext } from '@/contexts/YjsContext';
import { useYjsFragmentInit } from '@/hooks/useYjsFragmentInit';
import { stripNewlinesPaste } from '@/utils/tiptapPaste';

export function useDescriptionEditor(
  description: string | undefined,
  onSave: (value: string) => void,
) {
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const yjsCtx = useYjsContext();
  const fragment = yjsCtx?.ydoc.getXmlFragment(YJS_FIELDS.description) ?? null;

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Placeholder.configure({ placeholder: '설명을 추가해 주세요' }),
        Extension.create({
          name: 'descriptionKeyboardShortcuts',
          addKeyboardShortcuts() {
            return {
              Enter: ({ editor: e }) => { e.view.dom.blur(); return true; },
              Escape: ({ editor: e }) => { e.commands.blur(); return true; },
            };
          },
        }),
        ...(fragment ? [Collaboration.configure({ fragment })] : []),
      ],
      content: fragment ? undefined : (description ?? ''),
      onBlur({ editor: e }) {
        onSaveRef.current(e.getText());
      },
      editorProps: {
        handlePaste: stripNewlinesPaste,
        attributes: { class: 'prose focus:outline-none text-sm' },
      },
      immediatelyRender: false,
    },
    [fragment],
  );

  useYjsFragmentInit(editor, fragment, description);

  return editor;
}
