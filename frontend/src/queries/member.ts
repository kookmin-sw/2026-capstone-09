'use client';

import { useQuery } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { memberKeys } from './keys/memberKeys';

export function useProjectMembersQuery(projectId: number) {
  return useQuery({
    queryKey: memberKeys.list(projectId),
    queryFn: () =>
      privateApi.projectMember.getAllMembers(projectId).then((res) => res.data.data?.members ?? []),
    enabled: !!projectId,
  });
}
