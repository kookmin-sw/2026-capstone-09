'use client';

import type { Editor } from '@tiptap/react';
import {
  IconBold,
  IconCode,
  IconLineHorizontal,
  IconList,
  IconListOrdered,
  IconQuote,
  IconStrikethrough,
} from '@wanteddev/wds-icon';
import type { ReactNode } from 'react';

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
      className={`flex h-7 w-7 items-center justify-center rounded text-sm transition-colors ${
        active
          ? 'bg-fill-alternative text-label-normal'
          : 'text-label-alternative hover:bg-fill-alternative hover:text-label-normal'
      }`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="mx-1 h-4 w-px bg-line-normal" />;
}

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line-normal px-2 py-1">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="제목 1"
      >
        <span className="text-xs font-bold">H1</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="제목 2"
      >
        <span className="text-xs font-bold">H2</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="제목 3"
      >
        <span className="text-xs font-bold">H3</span>
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="굵게"
      >
        <IconBold width={16} height={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="기울임"
      >
        <span className="font-serif italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="취소선"
      >
        <IconStrikethrough width={16} height={16} />
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        title="인라인 코드"
      >
        <IconCode width={16} height={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="코드 블록"
      >
        <span className="font-mono text-xs">{'{}'}</span>
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="글머리 기호 목록"
      >
        <IconList width={16} height={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="번호 매기기 목록"
      >
        <IconListOrdered width={16} height={16} />
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="인용구"
      >
        <IconQuote width={16} height={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        active={false}
        title="구분선"
      >
        <IconLineHorizontal width={16} height={16} />
      </ToolbarButton>
    </div>
  );
}
