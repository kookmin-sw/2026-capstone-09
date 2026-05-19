'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { privateApi } from '@/api';
import type { CreateEdgeRequest } from '@/api/Api';
import { edgeKeys } from './keys/edgeKeys';

export function useLinkedNodesQuery(projectId: number, nodeId: number) {
  return useQuery({
    queryKey: edgeKeys.linked(projectId, nodeId),
    queryFn: () =>
      privateApi.node
        .getLinkedNodes(projectId, nodeId)
        .then((res) => res.data.data?.linkedNodes ?? []),
    enabled: !!projectId && !!nodeId,
  });
}

export function useNodeListQuery(projectId: number) {
  return useQuery({
    queryKey: edgeKeys.nodeList(projectId),
    queryFn: () =>
      privateApi.node.getNodeList(projectId).then((res) => res.data.data?.nodes ?? []),
    enabled: !!projectId,
  });
}

export function useCreateEdgeMutation(projectId: number) {
  return useMutation({
    mutationFn: (data: CreateEdgeRequest) => privateApi.edge.createEdge(projectId, data),
  });
}
