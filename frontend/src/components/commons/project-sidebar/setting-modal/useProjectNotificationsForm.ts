'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  useNotificationSettingQuery,
  useUpdateNotificationSettingMutation,
} from '@/queries/notification';

interface NotificationSettings {
  meetingEnabled: boolean;
  nodeEnabled: boolean;
  desktopEnabled: boolean;
  emailEnabled: boolean;
}

interface UseProjectNotificationsFormParams {
  projectId: number;
  onSaveSuccess?: () => void;
  onSaveError?: (message: string) => void;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  meetingEnabled: false,
  nodeEnabled: false,
  desktopEnabled: false,
  emailEnabled: false,
};

const extractErrorCode = (caught: unknown): string | undefined => {
  if (typeof caught !== 'object' || caught === null) return undefined;
  const obj = caught as { error?: { code?: string }; code?: string };
  return obj.error?.code ?? obj.code;
};

export const useProjectNotificationsForm = ({
  projectId,
  onSaveSuccess,
  onSaveError,
}: UseProjectNotificationsFormParams) => {
  const { data: queryData, isSuccess } = useNotificationSettingQuery(projectId);
  const updateMutation = useUpdateNotificationSettingMutation(projectId);

  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isSuccess) return;
    setSettings({
      meetingEnabled: queryData?.meetingEnabled ?? false,
      nodeEnabled: queryData?.nodeEnabled ?? false,
      desktopEnabled: queryData?.desktopEnabled ?? false,
      emailEnabled: queryData?.emailEnabled ?? false,
    });
    setIsLoaded(true);
  }, [isSuccess, queryData]);

  const setField = useCallback(
    async <K extends keyof NotificationSettings>(field: K, value: NotificationSettings[K]) => {
      const prevValue = settings[field];
      const nextSettings: NotificationSettings = { ...settings, [field]: value };
      setSettings(nextSettings);
      try {
        const response = await updateMutation.mutateAsync(nextSettings);
        const data = response.data.data;
        if (data) {
          setSettings({
            meetingEnabled: data.meetingEnabled ?? false,
            nodeEnabled: data.nodeEnabled ?? false,
            desktopEnabled: data.desktopEnabled ?? false,
            emailEnabled: data.emailEnabled ?? false,
          });
        }
        onSaveSuccess?.();
      } catch (caught) {
        setSettings((prev) => ({ ...prev, [field]: prevValue }));
        const code = extractErrorCode(caught);
        if (code === 'NOTIFICATION_SETTING_NOT_FOUND') {
          onSaveError?.('알림 설정이 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요');
        } else {
          onSaveError?.('알림 설정 저장에 실패했어요');
        }
      }
    },
    [projectId, settings, onSaveSuccess, onSaveError, updateMutation],
  );

  return {
    settings,
    isLoaded,
    setField,
  };
};
