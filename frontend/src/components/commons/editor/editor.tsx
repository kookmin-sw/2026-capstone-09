'use client';

import { Collaboration, isChangeOrigin } from '@tiptap/extension-collaboration';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import { Markdown, type MarkdownStorage } from 'tiptap-markdown';
import type { XmlFragment } from 'yjs';

import { useYjsContext } from '@/contexts/YjsContext';
import { useYjsFragmentInit } from '@/hooks/useYjsFragmentInit';
import { EditorToolbar } from './EditorToolbar';
import { TypingProfilePresence } from './TypingProfilePresence';
import { uploadImage } from './uploadImage';

const SAVE_DEBOUNCE_MS = 1000;

interface EditorProps {
  content: string | undefined;
  /** Yjs XmlFragment — 전달 시 협업 편집 활성화 */
  fragment?: XmlFragment | null;
  /** 로컬 변경 발생 후 디바운스 저장 콜백 */
  onUpdate?: (markdown: string) => void;
  /** false 전달 시 읽기 전용 (기본값: true) */
  editable?: boolean;
  /** Yjs awareness typing profile 표시 대상 필드 */
  collaborationField?: string;
}

export default function Editor({
  content,
  fragment,
  onUpdate,
  editable = true,
  collaborationField,
}: EditorProps) {
  const yjsCtx = useYjsContext();
  const onUpdateRef = useRef(onUpdate);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Markdown,
        Placeholder.configure({ placeholder: '내용을 입력하세요.' }),
        Image.configure({ inline: false, allowBase64: false }),
        ...(fragment ? [Collaboration.configure({ fragment })] : []),
      ],
      editable,
      content: fragment ? undefined : (content ?? ''),
      onUpdate({ editor: e, transaction }) {
        if (isChangeOrigin(transaction)) return;

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          const mdStorage = (e.storage as unknown as Record<string, unknown>)
            .markdown as MarkdownStorage;
          onUpdateRef.current?.(mdStorage.getMarkdown());
        }, SAVE_DEBOUNCE_MS);
      },
      editorProps: {
        attributes: { class: 'prose focus:outline-none m-5 pb-40 pl-5' },
        handlePaste(view, event) {
          const items = Array.from(event.clipboardData?.items ?? []);
          const imageItem = items.find((item) => item.type.startsWith('image/'));
          if (!imageItem) return false;

          event.preventDefault();
          const file = imageItem.getAsFile();
          if (!file) return false;

          uploadImage(file).then((url) => {
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({ src: url }),
              ),
            );
          });
          return true;
        },
        handleDrop(view, event) {
          const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
            f.type.startsWith('image/'),
          );
          if (!files.length) return false;

          event.preventDefault();
          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
          if (pos === undefined) return false;

          files.forEach((file) => {
            uploadImage(file).then((url) => {
              view.dispatch(
                view.state.tr.insert(pos, view.state.schema.nodes.image.create({ src: url })),
              );
            });
          });
          return true;
        },
      },
      immediatelyRender: false,
    },
    [fragment],
  );

  useYjsFragmentInit(editor, fragment ?? null, content);

  useEffect(() => {
    if (!editor || editor.isDestroyed || fragment || content === undefined) return;
    editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor, fragment]);

  return (
    <div className="relative w-full" data-typing-profile-container>
      {editable && <EditorToolbar editor={editor} />}
      <div className="prose relative overflow-x-hidden [&_.ProseMirror]:leading-[1.4] [&_.ProseMirror_p]:my-0">
        <EditorContent editor={editor} />
        {fragment && collaborationField && editable && (
          <TypingProfilePresence editor={editor} yjsCtx={yjsCtx} field={collaborationField} />
        )}
      </div>
    </div>
  );
}
