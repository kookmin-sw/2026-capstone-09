'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import type { CreateMeetingRequest } from '@/api/Api';

import { meetingKeys } from './keys/meetingKeys';

export function useCreateMeetingMutation(projectId: number, nodeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMeetingRequest) =>
      privateApi.meeting.createMeeting(projectId, nodeId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: meetingKeys.list(projectId, nodeId) }),
  });
}
