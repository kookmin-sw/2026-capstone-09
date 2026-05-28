'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import type { CreateEdgeRequest, EdgeItem, GetFlowchartResponse } from '@/api/Api';
import { edgeKeys } from './keys/edgeKeys';
import { nodeKeys } from './keys/nodeKeys';

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
    queryFn: () => privateApi.node.getNodeList(projectId).then((res) => res.data.data?.nodes ?? []),
    enabled: !!projectId,
  });
}

export function useCreateEdgeMutation(projectId: number) {
  const queryClient = useQueryClient();
  const flowchartKey = nodeKeys.flowchart(projectId);

  return useMutation({
    mutationFn: (data: CreateEdgeRequest) => privateApi.edge.createEdge(projectId, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: flowchartKey });

      const previousFlowchart = queryClient.getQueryData<GetFlowchartResponse | null>(flowchartKey);
      const tempEdgeId = -Date.now();
      const tempEdge: EdgeItem = {
        edgeId: tempEdgeId,
        startNodeId: data.startNodeId,
        endNodeId: data.endNodeId,
        comment: data.comment,
        createdBy: {
          userId: 0,
          nickname: '',
          email: '',
          profileImageUrl: '',
        },
      };

      queryClient.setQueryData<GetFlowchartResponse | null>(flowchartKey, (old) =>
        old
          ? {
              ...old,
              edges: [...(old.edges ?? []), tempEdge],
            }
          : old,
      );

      return { previousFlowchart };
    },
    onError: (_err, _data, context) => {
      if (context?.previousFlowchart !== undefined) {
        queryClient.setQueryData(flowchartKey, context.previousFlowchart);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: flowchartKey });
    },
  });
}

export function useDeleteEdgeMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (edgeId: number) => privateApi.edge.deleteEdge(projectId, edgeId),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: nodeKeys.flowchart(projectId) });
      void queryClient.invalidateQueries({ queryKey: [...edgeKeys.all, 'linked', projectId] });
    },
  });
}
