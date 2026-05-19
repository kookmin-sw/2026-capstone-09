'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import type { UpdateUserRequest, VerifyEmailRequest } from '@/api/Api';
import { userKeys } from './keys/userKeys';

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => privateApi.user.getMe().then((res) => res.data.data),
  });
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => privateApi.user.updateMe(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() }),
  });
}

export function useUpdateProfileImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileImage: File) => privateApi.user.updateProfileImage({ profileImage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() }),
  });
}

export function useDeleteMeMutation() {
  return useMutation({
    mutationFn: () => privateApi.user.deleteMe(),
  });
}

export function useSendEmailVerificationMutation() {
  return useMutation({
    mutationFn: (email: string) => privateApi.user.sendEmailVerification({ email }),
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => privateApi.user.verifyEmail(data),
  });
}
