'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { CreateTagRequest, GetFlowchartResponse, TagItem, UpdateTagRequest } from '@/api/Api';
import { nodeKeys } from './keys/nodeKeys';
import { tagKeys } from './keys/tagKeys';

export function useProjectTagsQuery(projectId: number) {
  return useQuery({
    queryKey: tagKeys.list(projectId),
    queryFn: () =>
      privateApi.tag.getAllTags(projectId).then((res) => res.data.data?.tags ?? []),
    enabled: !!projectId,
  });
}

export function useAddNodeTagMutation(projectId: number, nodeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId: number) =>
      privateApi.tag.addNodeTag(projectId, nodeId, { tagId }),
    onSuccess: (_data, tagId) => {
      const allTags = queryClient.getQueryData<TagItem[]>(tagKeys.list(projectId));
      const tag = allTags?.find((t) => t.tagId === tagId);
      if (tag) {
        queryClient.setQueryData<GetFlowchartResponse>(nodeKeys.flowchart(projectId), (old) =>
          old
            ? { ...old, nodes: old.nodes?.map((n) => (n.nodeId === nodeId ? { ...n, tags: [...(n.tags ?? []), tag] } : n)) }
            : old,
        );
      }
      void queryClient.invalidateQueries({ queryKey: nodeKeys.detail(projectId, nodeId) });
    },
  });
}

export function useRemoveNodeTagMutation(projectId: number, nodeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId: number) => privateApi.tag.removeNodeTag(projectId, nodeId, tagId),
    onSuccess: (_data, tagId) => {
      queryClient.setQueryData<GetFlowchartResponse>(nodeKeys.flowchart(projectId), (old) =>
        old
          ? { ...old, nodes: old.nodes?.map((n) => (n.nodeId === nodeId ? { ...n, tags: n.tags?.filter((t) => t.tagId !== tagId) } : n)) }
          : old,
      );
      void queryClient.invalidateQueries({ queryKey: nodeKeys.detail(projectId, nodeId) });
    },
  });
}

export function useDeleteTagMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId: number) => privateApi.tag.deleteTag(projectId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.list(projectId) });
    },
  });
}

export function useUpdateTagColorMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, name, color }: { tagId: number } & Pick<UpdateTagRequest, 'name' | 'color'>) =>
      privateApi.tag.updateTag(projectId, tagId, { name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.list(projectId) });
    },
  });
}

export function useCreateTagMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTagRequest) =>
      privateApi.tag.createTag(projectId, data).then((res) => res.data.data as TagItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.list(projectId) });
    },
  });
}
