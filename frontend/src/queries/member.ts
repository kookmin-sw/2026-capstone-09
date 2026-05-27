'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { memberKeys } from './keys/memberKeys';
import { nodeKeys } from './keys/nodeKeys';

export function useProjectMembersQuery(projectId: number) {
  return useQuery({
    queryKey: memberKeys.list(projectId),
    queryFn: () =>
      privateApi.projectMember.getAllMembers(projectId).then((res) => res.data.data?.members ?? []),
    enabled: !!projectId,
  });
}

export function useAddAssigneeMutation(projectId: number, nodeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      privateApi.nodeAssignee.createAssignee(projectId, nodeId, { userId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: nodeKeys.detail(projectId, nodeId) });
    },
  });
}

export function useRemoveAssigneeMutation(projectId: number, nodeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assigneeId: number) =>
      privateApi.nodeAssignee.deleteAssignee(projectId, nodeId, assigneeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: nodeKeys.detail(projectId, nodeId) });
    },
  });
}

export function useInviteMemberMutation(projectId: number) {
  return useMutation({
    mutationFn: (email: string) => privateApi.project.inviteMember(projectId, { email }),
  });
}

export function useUpdateMemberRoleMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: number; role: 'VIEWER' | 'MEMBER' | 'OWNER' }) =>
      privateApi.projectMember.updateMemberRole(projectId, memberId, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.list(projectId) }),
  });
}

export function useDeleteMemberMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => privateApi.projectMember.deleteMember(projectId, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.list(projectId) }),
  });
}
