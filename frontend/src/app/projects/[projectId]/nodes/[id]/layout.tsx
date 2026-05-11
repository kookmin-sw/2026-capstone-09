'use client';

import { usePathname } from 'next/navigation';

import NodeMeetingTab from '@/components/node-datail/meeting/NodeMeetingTab';
import NodeNoteTab from '@/components/node-datail/note/NodeNoteTab';
import { NodePageLayoutClient } from './_components/NodePageLayoutClient';

export default function NodePageLayout() {
  const pathname = usePathname();

  const segments = pathname.split('/');
  const nodeSegment = segments[segments.length - 2];
  const projectSegment = segments[segments.length - 4];
  const nodeId = Number(nodeSegment);
  const projectId = Number(projectSegment);

  return (
    <div className="flex h-full w-full justify-center bg-white pt-14">
      <div className="w-1/2">
        <NodePageLayoutClient
          nodeId={nodeId}
          projectId={projectId}
          noteContent={<NodeNoteTab nodeId={nodeId} projectId={projectId} />}
          meetingContent={<NodeMeetingTab nodeId={nodeId} projectId={projectId} />}
        />
      </div>
    </div>
  );
}
