'use client';

import { Placeholder } from '@tiptap/extensions';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

interface EditorProps {
  content: string | undefined;
}

export default function Editor({ content }: EditorProps) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Markdown,
        Placeholder.configure({
          placeholder: '내용을 입력하세요.',
        }),
      ],

      content: content ?? '',

      editorProps: {
        attributes: {
          class: 'prose focus:outline-none m-5 pb-40',
        },
      },

      immediatelyRender: false,
    },
    [content],
  );

  return (
    <div className="prose [&_.ProseMirror]:leading-[1.4] [&_.ProseMirror_p]:my-0">
      <EditorContent editor={editor} />
    </div>
  );
}
