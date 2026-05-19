'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import type { ProjectUrlRequest } from '@/api/Api';
import { projectKeys } from './keys/projectKeys';

export function useAddUrlMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectUrlRequest) => privateApi.projectUrl.addUrl(projectId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) }),
  });
}

export function useUpdateUrlMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ urlId, data }: { urlId: number; data: ProjectUrlRequest }) =>
      privateApi.projectUrl.updateUrl(projectId, urlId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) }),
  });
}

export function useDeleteUrlMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (urlId: number) => privateApi.projectUrl.deleteUrl(projectId, urlId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) }),
  });
}
