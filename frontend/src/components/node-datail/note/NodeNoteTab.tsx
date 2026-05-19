'use client';

import { useYjsContext, YJS_FIELDS } from '@/contexts/YjsContext';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useNodeDetailQuery, useUpdateNodeNoteMutation } from '@/queries/node';
import Editor from '../../commons/editor/editor';

interface NodeNoteTabProps {
  nodeId: number | null;
  projectId: number;
}

export default function NodeNoteTab({ nodeId, projectId }: NodeNoteTabProps) {
  const { data: nodeDetail } = useNodeDetailQuery(projectId, nodeId);
  const showErrorToast = useErrorToast();
  const { mutate: updateNote } = useUpdateNodeNoteMutation(projectId, nodeId ?? 0);
  const yjsCtx = useYjsContext();
  const fragment = yjsCtx?.ydoc.getXmlFragment(YJS_FIELDS.note) ?? null;

  const isMainNode = !nodeDetail?.parentId;

  const handleUpdate = (markdown: string) => {
    if (!nodeId) return;
    updateNote(markdown, {
      onError: (err) => showErrorToast(err, '노트 저장에 실패했어요.'),
    });
  };

  return (
    <main className="flex">
      {isMainNode ? (
        <Editor content={nodeDetail?.mainSummary} editable={false} />
      ) : (
        <Editor
          content={nodeDetail?.noteContent}
          fragment={fragment}
          onUpdate={handleUpdate}
        />
      )}
    </main>
  );
}
