'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { nodeKeys } from './keys/nodeKeys';

export function useDeleteNodeMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nodeId: number) => privateApi.node.deleteNode(projectId, nodeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: nodeKeys.all });
    },
  });
}
