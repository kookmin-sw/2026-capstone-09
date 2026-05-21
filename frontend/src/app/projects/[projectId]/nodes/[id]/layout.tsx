'use client';

import { IconButton } from '@wanteddev/wds';
import { IconChevronLeft } from '@wanteddev/wds-icon';
import { usePathname, useRouter } from 'next/navigation';

import NodeMeetingTab from '@/components/node-datail/meeting/NodeMeetingTab';
import NodeNoteTab from '@/components/node-datail/note/NodeNoteTab';
import { YjsProvider, useSetActiveAwarenessNode } from '@/contexts/YjsContext';
import { NodePageLayoutClient } from './_components/NodePageLayoutClient';

export default function NodePageLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/');
  const nodeSegment = segments[segments.length - 2];
  const projectSegment = segments[segments.length - 4];
  const nodeId = Number(nodeSegment);
  const projectId = Number(projectSegment);

  useSetActiveAwarenessNode(Number.isFinite(nodeId) ? nodeId : null);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex h-14 shrink-0 items-center px-4">
        <IconButton onClick={() => router.back()} size={18}>
          <IconChevronLeft className="text-neutral-60 shrink-0" />
        </IconButton>
      </div>
      <div className="flex flex-1 justify-center overflow-hidden">
        <div className="w-1/2">
          <YjsProvider nodeId={nodeId}>
            <NodePageLayoutClient
              nodeId={nodeId}
              projectId={projectId}
              noteContent={<NodeNoteTab nodeId={nodeId} projectId={projectId} />}
              meetingContent={<NodeMeetingTab nodeId={nodeId} projectId={projectId} />}
            />
          </YjsProvider>
        </div>
      </div>
    </div>
  );
}
