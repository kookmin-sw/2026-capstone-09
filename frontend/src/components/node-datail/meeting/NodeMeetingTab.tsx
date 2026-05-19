'use client';

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
  const meeting = nodeDetail?.meeting;

  if (!meeting) return <CreateMeeting />;
  if (!meeting.summary) return <HasMeeting />;

  return (
    <MeetingSummary
      summary={meeting.summary}
      mermaidCode={meeting.mermaidCode}
      participants={meeting.participants}
    />
  );
};

export default NodeMeetingTab;
