'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import type { CreateMeetingRequest, UpdateMeetingRequest } from '@/api/Api';

import { meetingKeys } from './keys/meetingKeys';
import { nodeKeys } from './keys/nodeKeys';

export function useCreateMeetingMutation(projectId: number, nodeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMeetingRequest) =>
      privateApi.meeting.createMeeting(projectId, nodeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.list(projectId, nodeId) });
      void queryClient.invalidateQueries({ queryKey: nodeKeys.detail(projectId, nodeId) });
    },
  });
}

export function useUpdateMeetingMutation(
  projectId: number,
  nodeId: number,
  meetingId: number,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateMeetingRequest) =>
      privateApi.meeting.updateMeeting(projectId, nodeId, meetingId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.list(projectId, nodeId) });
      void queryClient.invalidateQueries({ queryKey: nodeKeys.detail(projectId, nodeId) });
    },
  });
}
