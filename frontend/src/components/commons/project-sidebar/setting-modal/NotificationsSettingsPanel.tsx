'use client';

import { Checkbox, Switch } from '@wanteddev/wds';

import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';

import { useProjectNotificationsForm } from './useProjectNotificationsForm';

interface NotificationRowProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const NotificationRow = ({ label, checked, onCheckedChange, disabled }: NotificationRowProps) => {
  return (
    <div className="flex w-40 items-center justify-between gap-2 py-3">
      <span className="text-label-1 text-label-normal">{label}</span>
      <Switch
        size="small"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};

interface NotificationsSettingsPanelProps {
  projectId: number;
}

/**
 * 설정 모달 - 알림 탭.
 *
 * - 마운트 시 `getNotificationSetting(projectId)` → 초기값 로드.
 * - 각 토글 변경 시 즉시 `updateNotificationSetting(projectId, { [field]: value })` 호출 (낙관적 업데이트).
 * - 폼 상태/검증/저장은 `useProjectNotificationsForm` 훅에 분리.
 */
export const NotificationsSettingsPanel = ({ projectId }: NotificationsSettingsPanelProps) => {
  const toast = usePositionedToast();
  const { settings, isLoaded, setField } = useProjectNotificationsForm({
    projectId,
    onSaveError: (message) => {
      toast({
        content: message,
        variant: 'negative',
        placement: 'bottom-left',
        duration: 'short',
      });
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <NotificationRow
          label="회의 알림"
          checked={settings.meetingEnabled}
          onCheckedChange={(checked) => void setField('meetingEnabled', checked)}
          disabled={!isLoaded}
        />
        <NotificationRow
          label="노드 알림"
          checked={settings.nodeEnabled}
          onCheckedChange={(checked) => void setField('nodeEnabled', checked)}
          disabled={!isLoaded}
        />
      </div>

      <div aria-hidden="true" className="bg-line-normal-normal h-px w-full" />

      <div className="flex items-center gap-10">
        <span className="text-label-1 text-static-black">알림 수신 방법</span>
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 py-3">
            <Checkbox
              size="small"
              checked={settings.desktopEnabled}
              onCheckedChange={(checked) => void setField('desktopEnabled', checked)}
              disabled={!isLoaded}
              tight
            />
            <span className="text-caption-1 text-label-normal">데스크톱</span>
          </label>
          <label className="flex items-center gap-2 py-3">
            <Checkbox
              size="small"
              checked={settings.emailEnabled}
              onCheckedChange={(checked) => void setField('emailEnabled', checked)}
              disabled={!isLoaded}
              tight
            />
            <span className="text-caption-1 text-label-normal">이메일</span>
          </label>
        </div>
      </div>
    </div>
  );
};

NotificationsSettingsPanel.displayName = 'NotificationsSettingsPanel';
