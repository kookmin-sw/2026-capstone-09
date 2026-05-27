'use client';

import type { Editor } from '@tiptap/react';
import {
  IconBold,
  IconCode,
  IconImage,
  IconLineHorizontal,
  IconList,
  IconListOrdered,
  IconQuote,
  IconStrikethrough,
} from '@wanteddev/wds-icon';
import { useRef, type ReactNode } from 'react';

import { uploadImage } from './uploadImage';

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`flex h-7 w-7 shrink-0 items-center justify-center bg-transparent text-sm transition-colors ${
        active ? 'text-primary-40' : 'text-label-alternative'
      }`}
    >
      {children}
    </button>
  );
}

function Group({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Divider() {
  return <div className="bg-line-normal-neutral mx-1.5 h-4 w-px shrink-0" />;
}

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleImageFile = (file: File) => {
    uploadImage(file).then((url) => {
      editor.chain().focus().setImage({ src: url }).run();
    });
  };

  return (
    <div className="border-line-normal-neutral bg-static-white sticky top-0 z-10 flex w-full flex-wrap items-center gap-y-1 border-b px-3 py-2">
      <Group>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="제목 1"
        >
          <span className="text-[11px] font-bold tracking-tight">H1</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="제목 2"
        >
          <span className="text-[11px] font-bold tracking-tight">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="제목 3"
        >
          <span className="text-[11px] font-bold tracking-tight">H3</span>
        </ToolbarButton>
      </Group>

      <Divider />

      <Group>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="굵게"
        >
          <IconBold width={15} height={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="기울임"
        >
          <span className="text-sm" style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
            I
          </span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="취소선"
        >
          <IconStrikethrough width={15} height={15} />
        </ToolbarButton>
      </Group>

      <Divider />

      <Group>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="인라인 코드"
        >
          <IconCode width={15} height={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="코드 블록"
        >
          <span className="font-mono text-[11px] font-medium">{'{}'}</span>
        </ToolbarButton>
      </Group>

      <Divider />

      <Group>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="글머리 기호 목록"
        >
          <IconList width={15} height={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="번호 매기기 목록"
        >
          <IconListOrdered width={15} height={15} />
        </ToolbarButton>
      </Group>

      <Divider />

      <Group>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="인용구"
        >
          <IconQuote width={15} height={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
          title="구분선"
        >
          <IconLineHorizontal width={15} height={15} />
        </ToolbarButton>
      </Group>

      <Divider />

      <Group>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} active={false} title="이미지">
          <IconImage width={15} height={15} />
        </ToolbarButton>
      </Group>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
