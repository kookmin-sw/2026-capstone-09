'use client';

import { useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { Extension } from '@tiptap/core';

export function useTitleEditor(title: string | undefined, onSave: (value: string) => void) {
  const titleRef = useRef(title);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  return useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: '제목을 입력하세요.',
        }),
        Extension.create({
          name: 'preventEnterRevertOnEscape',
          addKeyboardShortcuts() {
            return {
              Enter: ({ editor }) => {
                editor.view.dom.blur();
                return true;
              },
              Escape: ({ editor }) => {
                editor.commands.setContent(titleRef.current ?? '');
                editor.view.dom.blur();
                return true;
              },
            };
          },
        }),
      ],
      content: title ?? '새 노드',
      onBlur({ editor }) {
        onSaveRef.current(editor.getText());
      },
      editorProps: {
        handlePaste(view, event) {
          const text = event.clipboardData?.getData('text/plain');
          if (text) {
            event.preventDefault();
            view.dispatch(view.state.tr.insertText(text.replace(/\n/g, ' ')));
            return true;
          }
          return false;
        },
        attributes: {
          class: 'prose focus:outline-none text-2xl font-medium',
        },
      },
      immediatelyRender: false,
    },
    [title],
  );
}
