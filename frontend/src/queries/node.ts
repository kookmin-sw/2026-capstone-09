'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { GetNodeResponse } from '@/api/Api';
import { NodeStatusType } from '@/constants/nodeStatus';
import { nodeKeys } from './keys/nodeKeys';

export function useFlowchartQuery(projectId: number) {
  return useQuery({
    queryKey: nodeKeys.flowchart(projectId),
    queryFn: async () => {
      const response = await privateApi.node.getFlowchart(projectId);
      return response.data.data ?? null;
    },
    enabled: !!projectId,
  });
}

export function useNodeListQuery(projectId: number, sort: 'LATEST' | 'NAME' = 'LATEST') {
  return useQuery({
    queryKey: nodeKeys.list(projectId, sort),
    queryFn: async () => {
      const response = await privateApi.node.getNodeList(projectId, { sort });
      return response.data.data;
    },
    enabled: !!projectId,
  });
}

export function useNodeDetailQuery(projectId: number, nodeId: number | null) {
  return useQuery({
    queryKey: nodeKeys.detail(projectId, nodeId),
    queryFn: () => privateApi.node.getNode(projectId, nodeId!).then((res) => res.data.data),
    enabled: !!projectId && !!nodeId,
  });
}

export function useUpdateNodeDescriptionMutation(projectId: number, nodeId: number) {
  return useMutation({
    mutationFn: (description: string) =>
      privateApi.node.updateNodeDescription(projectId, nodeId, { description }),
  });
}

export function useUpdateNodeStatusMutation(projectId: number, nodeId: number) {
  return useMutation({
    mutationFn: (status: NodeStatusType) =>
      privateApi.node.updateNodeStatus(projectId, nodeId, { status }),
  });
}

export function useUpdateNodeNoteMutation(projectId: number, nodeId: number) {
  return useMutation({
    mutationFn: (noteContent: string) =>
      privateApi.node.updateNodeNote(projectId, nodeId, { noteContent }),
  });
}

export function useCreateSubNodeMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (parentId: number) =>
      privateApi.node.createNode(projectId, { title: '새 서브 노드', type: 'SUB', parentId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: nodeKeys.list(projectId) });
    },
  });
}

export function useUpdateNodeTitleMutation(projectId: number, nodeId: number | null) {
  const queryClient = useQueryClient();
  const queryKey = nodeKeys.detail(projectId, nodeId);

  return useMutation({
    mutationFn: (title: string) =>
      privateApi.node.updateNodeTitle(projectId, nodeId!, { title }),
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<GetNodeResponse>(queryKey);
      queryClient.setQueryData(queryKey, (old: GetNodeResponse | undefined) =>
        old ? { ...old, title } : old,
      );
      return { previous };
    },
    onError: (_err, _title, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });
}
