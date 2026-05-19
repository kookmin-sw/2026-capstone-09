'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';

import { projectKeys } from './keys/projectKeys';

export function useProjectQuery(projectId: number) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => privateApi.project.getProject(projectId).then((res) => res.data.data),
    enabled: !!projectId,
  });
}

export function useUpdateProjectMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => privateApi.project.updateProject(projectId, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) }),
  });
}

export function useUpdateProjectImageMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileImage: File) =>
      privateApi.project.updateProfileImage1(projectId, { profileImage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) }),
  });
}

export function useDeleteProjectMutation(projectId: number) {
  return useMutation({
    mutationFn: () => privateApi.project.deleteProject(projectId),
  });
}

export function useLeaveProjectMutation(projectId: number) {
  return useMutation({
    mutationFn: () => privateApi.projectMember.leaveProject(projectId),
  });
}
