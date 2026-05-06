'use client';

import { useQuery } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { nodeKeys } from './keys/nodeKeys';

export function useNodeDetailQuery(projectId: number, nodeId: number | null) {
  return useQuery({
    queryKey: nodeKeys.detail(projectId, nodeId ?? 0),
    queryFn: () => privateApi.node.getNode(projectId, nodeId!).then((res) => res.data.data),
    enabled: !!projectId && !!nodeId,
  });
}
