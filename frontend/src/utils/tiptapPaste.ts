import type { EditorOptions } from '@tiptap/core';

type HandlePaste = NonNullable<NonNullable<EditorOptions['editorProps']>['handlePaste']>;

/** 붙여넣기 시 줄바꿈을 공백으로 대체해 단일 라인을 유지하는 핸들러 */
export const stripNewlinesPaste: HandlePaste = (view, event): boolean => {
  const text = event.clipboardData?.getData('text/plain');
  if (text) {
    event.preventDefault();
    view.dispatch(view.state.tr.insertText(text.replace(/\n/g, ' ')));
    return true;
  }
  return false;
};
