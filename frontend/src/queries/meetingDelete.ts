'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { nodeKeys } from './keys/nodeKeys';

export function useDeleteMeetingMutation(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, meetingId }: { nodeId: number; meetingId: number }) =>
      privateApi.meeting.deleteMeeting(projectId, nodeId, meetingId),
    onSuccess: (_, { nodeId }) => {
      void queryClient.invalidateQueries({ queryKey: nodeKeys.detail(projectId, nodeId) });
      void queryClient.invalidateQueries({ queryKey: nodeKeys.flowchart(projectId) });
    },
  });
}
