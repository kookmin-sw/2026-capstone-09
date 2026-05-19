'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

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

export function useAddAssigneeMutation(projectId: number, nodeId: number) {
  return useMutation({
    mutationFn: (userId: number) =>
      privateApi.nodeAssignee.createAssignee(projectId, nodeId, { userId }),
  });
}

export function useRemoveAssigneeMutation(projectId: number, nodeId: number) {
  return useMutation({
    mutationFn: (assigneeId: number) =>
      privateApi.nodeAssignee.deleteAssignee(projectId, nodeId, assigneeId),
  });
}
