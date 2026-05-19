export interface MultiNodeSummaryNode {
  id: number;
  label: string;
}

export interface MeetingRelationship {
  from?: string;
  to?: string;
  relation?: string;
  reason?: string;
}

export interface ActionItemsAnalysis {
  totalCount?: number;
  byPerson?: Record<string, { count?: number; rate?: number }>;
}

export interface CreateMultiNodeSummaryRequest {
  nodeIds: number[];
}

export interface MultiNodeSummaryResult {
  meetingRelationships?: readonly MeetingRelationship[];
  actionItemsAnalysis?: ActionItemsAnalysis;
  developmentIdeas?: string;
  mermaidCode?: string;
}
