'use client';

import { useMutation } from '@tanstack/react-query';

import { privateApi } from '@/api';
import type { MultiNodeSummaryResult } from '@/components/projects/project-detail/multi-node-summary/types';

export function useAnalyzeDraggedNodesMutation(projectId: number) {
  return useMutation({
    mutationFn: (nodeIds: number[]) =>
      privateApi.node
        .analyzeDraggedNodes(projectId, { nodeIds })
        .then((res) => res.data.data as MultiNodeSummaryResult | undefined),
  });
}