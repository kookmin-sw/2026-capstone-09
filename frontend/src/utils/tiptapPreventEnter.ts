import { Extension } from '@tiptap/core';

export const PreventEnter = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: () => true, // Enter 무시
      'Shift-Enter': () => true,
    };
  },
});
