'use client';

import { useMutation } from '@tanstack/react-query';

import { privateApi } from '@/api';

export function useDeleteNodeMutation(projectId: number) {
  return useMutation({
    mutationFn: (nodeId: number) => privateApi.node.deleteNode(projectId, nodeId),
  });
}
