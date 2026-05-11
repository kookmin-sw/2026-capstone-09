'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { privateApi } from '@/api';
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
