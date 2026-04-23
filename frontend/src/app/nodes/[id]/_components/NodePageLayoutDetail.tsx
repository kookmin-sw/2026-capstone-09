'use client';

import { usePathname, useRouter } from 'next/navigation';

import { NodeDetailLayout } from '@/components/node-datail/NodeDetailLayout';

interface NodePageLayoutDetailProps {
  id: string;
  noteContent: React.ReactNode;
  meetingContent: React.ReactNode;
}

export function NodePageLayoutClient({
  id,
  noteContent,
  meetingContent,
}: NodePageLayoutDetailProps) {
  const pathname = usePathname();
  const router = useRouter();

  const value = pathname.endsWith('meeting') ? 'meeting' : 'note';

  return (
    <NodeDetailLayout
      nodeId={id}
      noteContent={noteContent}
      meetingContent={meetingContent}
      value={value}
      onValueChange={(tab) => router.replace(`/nodes/${id}/${tab}`)}
    />
  );
}
