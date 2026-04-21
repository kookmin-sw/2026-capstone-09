export interface MultiNodeSummaryNode {
  id: string;
  label: string;
}

export interface MeetingRelationship {
  from: string;
  to: string;
  relation: string;
  reason: string;
}

export interface ActionItemsAnalysis {
  total_count: number;
  by_person: Record<string, { count: number; rate: number }>;
}

export interface MultiNodeSummaryResult {
  meeting_relationships: readonly MeetingRelationship[];
  action_items_analysis: ActionItemsAnalysis;
  development_ideas: string;
  mermaid_code: string;
}
