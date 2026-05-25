'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { IconSparkleFill } from '@wanteddev/wds-icon';
import { useEffect } from 'react';
import { Markdown } from 'tiptap-markdown';

import { MermaidDiagram } from '@/components/commons/mermaid/MermaidDiagram';
import { Users } from '@/components/commons/user/UserAvatarGroup';

interface Participant {
  userId?: number;
  nickname?: string;
  profileImageUrl?: string | null;
}

interface MeetingSummaryProps {
  summary: string;
  mermaidCode?: string;
  participants?: Participant[];
}

export function MeetingSummary({ summary, mermaidCode, participants }: MeetingSummaryProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ undoRedo: false }), Markdown],
    editable: false,
    content: summary,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(summary);
    }
  }, [editor, summary]);

  return (
    <div className="flex flex-col gap-6 p-4">
      {participants !== undefined && (
        <>
          <div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-label-1 text-label-normal font-semibold">회의 참여자</span>
              <Users users={participants} />
            </div>
            <hr className="border-label-disable mt-3 border-0 border-t" />
          </div>
        </>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <IconSparkleFill className="text-primary-40 h-4 w-4 shrink-0" />
          <span className="text-label-1 text-label-normal font-semibold">회의 요약</span>
        </div>
        <div className="border-primary-40 border-l-2 pl-3">
          <div className="prose prose-sm max-w-none prose-headings:text-base prose-headings:font-bold prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 [&_.ProseMirror]:outline-none">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
      {mermaidCode && (
        <div className="mt-4 flex flex-col gap-2 pb-20">
          <span className="text-label-1 text-label-normal font-semibold">회의 흐름</span>
          <div className="bg-background-normal-alternative border-label-disable overflow-x-auto rounded-xl border p-3">
            <MermaidDiagram code={mermaidCode} />
          </div>
        </div>
      )}
    </div>
  );
}
