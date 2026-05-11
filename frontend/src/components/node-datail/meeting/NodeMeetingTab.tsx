'use client';

import { useNodeDetailQuery } from '@/queries/node';
import CreateMeeting from './CreateMeeting';
import HasMeeting from './HasMeeting';

interface NodeMeetingTabProps {
  nodeId: number | null;
  projectId: number;
}

export const NodeMeetingTab = ({ nodeId, projectId }: NodeMeetingTabProps) => {
  const { data: nodeDetail } = useNodeDetailQuery(projectId, nodeId);

  return <>{nodeDetail?.meeting ? <HasMeeting /> : <CreateMeeting />}</>;
};

export default NodeMeetingTab;
