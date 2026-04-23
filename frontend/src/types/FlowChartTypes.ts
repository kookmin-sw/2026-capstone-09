export interface NodeTag {
  tagId: number;
  name: string;
  color: string;
}

export interface NodeAssignee {
  userId: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;
}

export interface NodeMeeting {
  meetingId: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: string;
  pushEnabled: boolean;
  pushNotifyAt: string;
}

export interface Node {
  nodeId: number;
  parentId: number | null;
  number: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  sortOrder: number;
  tags: NodeTag[];
  assignees: NodeAssignee[];
  hasMeeting: boolean;
  childNodeIds: number[];
  updatedAt: string;
}

export interface NodeDetail extends Node {
  projectId: number;
  noteContent: string;
  meeting: NodeMeeting | null;
  createdAt: string;
}

export interface EdgeCreator {
  userId: number;
  nickname: string;
  email: string;
  profileImageUrl: string;
}

export interface Edge {
  edgeId: number;
  startNodeId: number;
  endNodeId: number;
  createdBy: EdgeCreator;
  comment: string | null;
}

export interface FlowChart {
  nodes: Node[];
  edges: Edge[];
}

export interface FlowChartResponse {
  code: string;
  message: string;
  data: FlowChart;
}