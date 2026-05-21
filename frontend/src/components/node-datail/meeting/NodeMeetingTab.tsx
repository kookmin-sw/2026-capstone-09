'use client';

import { useNodeMenuActions } from '@/hooks/useNodeMenuActions';
import { useNodeDetailQuery } from '@/queries/node';
import CreateMeeting from './CreateMeeting';
import HasMeeting from './HasMeeting';
import { MeetingSummary } from './MeetingSummary';

interface NodeMeetingTabProps {
  nodeId: number | null;
  projectId: number;
}

export const NodeMeetingTab = ({ nodeId, projectId }: NodeMeetingTabProps) => {
  const { data: nodeDetail } = useNodeDetailQuery(projectId, nodeId);
  const { onCreateMeeting } = useNodeMenuActions({
    nodeId: nodeId ?? 0,
    projectId,
    nodeTitle: nodeDetail?.title,
    nodeNumber: nodeDetail?.number,
  });
  const meeting = nodeDetail?.meeting;

  if (!meeting) return <CreateMeeting onCreateMeeting={nodeId !== null ? onCreateMeeting : undefined} />;
  if (meeting?.status == 'IN_PROGRESS' || !meeting?.summary) return <HasMeeting />;

  return (
    <MeetingSummary
      summary={meeting.summary}
      mermaidCode={meeting.mermaidCode}
      participants={meeting.participants}
    />
  );
};

export default NodeMeetingTab;
