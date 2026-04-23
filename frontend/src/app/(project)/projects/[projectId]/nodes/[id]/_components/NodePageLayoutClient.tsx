'use client';

import { usePathname, useRouter } from 'next/navigation';

import { NodeDetailLayout } from '@/components/node-datail/NodeDetailLayout';

interface NodePageLayoutClientProps {
  nodeId: number;
  projectId: number;
  noteContent: React.ReactNode;
  meetingContent: React.ReactNode;
}

export function NodePageLayoutClient({
  nodeId,
  projectId,
  noteContent,
  meetingContent,
}: NodePageLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/');
  const lastSegment = segments[segments.length - 1];
  const value = lastSegment === 'meeting' ? 'meeting' : 'note';

  return (
    <NodeDetailLayout
      nodeId={nodeId}
      projectId={projectId}
      noteContent={noteContent}
      meetingContent={meetingContent}
      value={value}
      onValueChange={(tab) => router.replace(`/projects/${projectId}/nodes/${nodeId}/${tab}`)}
    />
  );
}
