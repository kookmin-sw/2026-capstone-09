'use client';

import { usePathname, useRouter } from 'next/navigation';
import { use } from 'react';

import { NodeDetailLayout } from '@/components/node-datail/NodeDetailLayout';
import NodeMeetingTab from '@/components/node-datail/NodeMeetingTab';
import NodeNoteTab from '@/components/node-datail/NodeNoteTab';

interface NodeDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function NodePageLayout({ params }: NodeDetailLayoutProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const pathname = usePathname();
  const router = useRouter();

  const value = pathname.endsWith('meeting') ? 'meeting' : 'note';

  return (
    <div className="flex h-full w-full justify-center bg-white">
      {/* TODO : 내부 요소들 사이즈 맞추고 사이즈 적절하게 조절 필요 */}
      <div className="w-1/2">
        <NodeDetailLayout
          nodeId={id}
          noteContent={<NodeNoteTab />}
          meetingContent={<NodeMeetingTab />}
          value={value}
          onValueChange={(tab) => router.push(`/nodes/${id}/${tab}`)}
        />
      </div>
    </div>
  );
}
