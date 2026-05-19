'use client';

import { useMutation } from '@tanstack/react-query';

import { privateApi } from '@/api';

export function useDeleteMeetingMutation(projectId: number) {
  return useMutation({
    mutationFn: ({ nodeId, meetingId }: { nodeId: number; meetingId: number }) =>
      privateApi.meeting.deleteMeeting(projectId, nodeId, meetingId),
  });
}
