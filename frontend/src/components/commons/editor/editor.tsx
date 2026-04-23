'use client';

import { Placeholder } from '@tiptap/extensions';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Placeholder.configure({
        placeholder: '내용을 입력하세요.',
      }),
    ],

    // TODO : API 연결 이후 API값으로 변경
    content: '',

    editorProps: {
      attributes: {
        class: 'prose focus:outline-none m-5',
      },
    },

    immediatelyRender: false,
  });

  return (
    <div className="prose [&_.ProseMirror]:leading-[1.4] [&_.ProseMirror_p]:my-0">
      <EditorContent editor={editor} />
    </div>
  );
}
