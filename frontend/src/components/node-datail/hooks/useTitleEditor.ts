'use client';

import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { Extension } from '@tiptap/core';

const PreventEnter = Extension.create({
  name: 'preventEnter',
  addKeyboardShortcuts() {
    return {
      Enter: () => true,
    };
  },
});

export function useTitleEditor(title?: string) {
  return useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '제목을 입력하세요.',
      }),
      PreventEnter,
    ],
    content: title ?? '새 노드',

    editorProps: {
      handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain');
        if (text) {
          event.preventDefault();
          view.dispatch(
            view.state.tr.insertText(text.replace(/\n/g, ' '))
          );
          return true;
        }
        return false;
      },
      attributes: {
        class: 'prose focus:outline-none text-2xl font-medium',
      },
    },

    immediatelyRender: false,
  });
}