'use client';

import { useCallback } from 'react';

import { useAnalyzeDraggedNodesMutation } from '@/queries/nodeAnalysis';

import type { MultiNodeSummaryNode, MultiNodeSummaryResult } from './types';

interface UseMultiNodeSummaryRequestParams {
  projectId: number;
  nodes: readonly MultiNodeSummaryNode[];
}

export const useMultiNodeSummaryRequest = ({
  projectId,
  nodes,
}: UseMultiNodeSummaryRequestParams) => {
  const { mutateAsync, isPending } = useAnalyzeDraggedNodesMutation(projectId);

  const handleSubmit = useCallback(async (): Promise<MultiNodeSummaryResult> => {
    const nodeIds = nodes.map((node) => node.id);
    const result = await mutateAsync(nodeIds);
    return result ?? {};
  }, [mutateAsync, nodes]);

  return {
    handleSubmit,
    isPending,
  };
};
