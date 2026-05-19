'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';

import { notificationKeys } from './keys/notificationKeys';

const extractErrorCode = (caught: unknown): string | undefined => {
  if (typeof caught !== 'object' || caught === null) return undefined;
  const obj = caught as { error?: { code?: string }; code?: string };
  return obj.error?.code ?? obj.code;
};

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () =>
      privateApi.notification.getUnreadCount().then((res) => res.data.data?.unreadCount ?? 0),
  });
}

export function useNotificationSettingQuery(projectId: number) {
  return useQuery({
    queryKey: notificationKeys.setting(projectId),
    queryFn: async () => {
      try {
        const res = await privateApi.notificationSetting.getNotificationSetting(projectId);
        return res.data.data ?? null;
      } catch (caught) {
        if (extractErrorCode(caught) === 'NOTIFICATION_SETTING_NOT_FOUND') return null;
        throw caught;
      }
    },
    enabled: !!projectId,
  });
}

export function useUpdateNotificationSettingMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: {
      meetingEnabled: boolean;
      nodeEnabled: boolean;
      desktopEnabled: boolean;
      emailEnabled: boolean;
    }) => privateApi.notificationSetting.updateNotificationSetting(projectId, settings),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.setting(projectId) }),
  });
}
