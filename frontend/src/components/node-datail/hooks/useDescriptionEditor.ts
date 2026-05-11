'use client';

import { useEffect, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { Extension } from '@tiptap/core';
import { useEditor } from '@tiptap/react';

export function useDescriptionEditor(
  description: string | undefined,
  onSave: (value: string) => void,
) {
  const descriptionRef = useRef(description);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    descriptionRef.current = description;
  }, [description]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  return useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: '설명을 추가해 주세요',
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
                editor.commands.setContent(descriptionRef.current ?? '');
                editor.commands.blur();
                return true;
              },
            };
          },
        }),
      ],
      content: description ?? '',
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
          class: 'prose focus:outline-none text-sm',
        },
      },
      immediatelyRender: false,
    },
    [description],
  );
}
