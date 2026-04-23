import NodeMeetingTab from '@/components/node-datail/NodeMeetingTab';
import NodeNoteTab from '@/components/node-datail/NodeNoteTab';
import { NodePageLayoutClient } from './_components/NodePageLayoutClient';

interface NodeDetailLayoutProps {
  params: Promise<{ id: string }>;
}

export default async function NodePageLayout({ params }: NodeDetailLayoutProps) {
  const { id } = await params;

  return (
    <div className="flex h-full w-full justify-center bg-white pt-14">
      <div className="w-1/2">
        <NodePageLayoutClient
          id={id}
          noteContent={<NodeNoteTab />}
          meetingContent={<NodeMeetingTab />}
        />
      </div>
    </div>
  );
}
