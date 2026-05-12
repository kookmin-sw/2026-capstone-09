'use client';

import { useNodeDetailQuery } from '@/queries/node';
import Editor from '../../commons/editor/editor';

interface NodeNoteTabProps {
  nodeId: number | null;
  projectId: number;
}

export default function NodeNoteTab({ nodeId, projectId }: NodeNoteTabProps) {
  const { data: nodeDetail } = useNodeDetailQuery(projectId, nodeId);

  return (
    <main className="flex">
      <Editor content={nodeDetail?.noteContent} />
    </main>
  );
}
