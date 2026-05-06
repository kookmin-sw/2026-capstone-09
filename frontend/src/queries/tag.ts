'use client';

import { useQuery } from '@tanstack/react-query';

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
