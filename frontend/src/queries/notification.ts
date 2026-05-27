'use client';

import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';
import type { NotificationSummaryResponse } from '@/api/Api';

import { notificationKeys } from './keys/notificationKeys';

const extractErrorCode = (caught: unknown): string | undefined => {
  if (typeof caught !== 'object' || caught === null) return undefined;
  const obj = caught as { error?: { code?: string }; code?: string };
  return obj.error?.code ?? obj.code;
};

const fetchNotificationSetting = async (projectId: number) => {
  try {
    const res = await privateApi.notificationSetting.getNotificationSetting(projectId);
    return res.data.data ?? null;
  } catch (caught) {
    if (extractErrorCode(caught) === 'NOTIFICATION_SETTING_NOT_FOUND') return null;
    throw caught;
  }
};

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () =>
      privateApi.notification.getUnreadCount().then((res) => res.data.data?.unreadCount ?? 0),
  });
}

/**
 * 수신함 알림 목록.
 * 전체 목록을 하나의 캐시(list)로 받아두고 select로 현재 프로젝트만 필터링한다.
 * 전역 staleTime(1분) 덕분에 수신함을 다시 열어도 같은 캐시를 재사용해 API 호출이 줄어든다.
 */
export function useNotificationListQuery(projectId: number) {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () =>
      privateApi.notification
        .getAllNotifications()
        .then((res) => res.data.data?.content ?? []),
    select: (items) => items.filter((notification) => notification.projectId === projectId),
    enabled: !!projectId,
  });
}

/**
 * 알림을 읽음 처리한다.
 * 목록 캐시를 낙관적으로 갱신해 dot을 즉시 없애고, 실패해도 UI는 그대로 둔다.
 */
export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => privateApi.notification.markAsRead(notificationId),
    onMutate: (notificationId) => {
      queryClient.setQueryData<NotificationSummaryResponse[]>(notificationKeys.list(), (prev) =>
        prev?.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    },
  });
}

export function useNotificationSettingQuery(projectId: number) {
  return useQuery({
    queryKey: notificationKeys.setting(projectId),
    queryFn: () => fetchNotificationSetting(projectId),
    enabled: !!projectId,
  });
}

/**
 * 알림 설정을 미리 가져와 캐시에 채워둔다.
 * 프로젝트 설정 모달이 열리기 직전에 호출해 알림 탭 토글 깜빡임을 방지하는 용도.
 */
export function prefetchNotificationSetting(queryClient: QueryClient, projectId: number) {
  return queryClient.prefetchQuery({
    queryKey: notificationKeys.setting(projectId),
    queryFn: () => fetchNotificationSetting(projectId),
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
