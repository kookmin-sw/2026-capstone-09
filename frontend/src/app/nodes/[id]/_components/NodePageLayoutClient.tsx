'use client';

import { usePathname, useRouter } from 'next/navigation';

import { NodeDetailLayout } from '@/components/node-datail/NodeDetailLayout';

interface NodePageLayoutClientProps {
  id: string;
  noteContent: React.ReactNode;
  meetingContent: React.ReactNode;
}

export function NodePageLayoutClient({
  id,
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
      nodeId={id}
      noteContent={noteContent}
      meetingContent={meetingContent}
      value={value}
      onValueChange={(tab) => router.replace(`/nodes/${id}/${tab}`)}
    />
  );
}
