'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { CreateTagRequest, TagItem, UpdateTagRequest } from '@/api/Api';
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
  return useMutation({
    mutationFn: (tagId: number) =>
      privateApi.tag.addNodeTag(projectId, nodeId, { tagId }),
  });
}

export function useRemoveNodeTagMutation(projectId: number, nodeId: number) {
  return useMutation({
    mutationFn: (tagId: number) => privateApi.tag.removeNodeTag(projectId, nodeId, tagId),
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
