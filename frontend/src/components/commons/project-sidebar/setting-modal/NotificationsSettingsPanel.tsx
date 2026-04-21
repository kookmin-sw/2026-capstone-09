'use client';

import { Checkbox, Switch } from '@wanteddev/wds';
import { useState } from 'react';

import { EXAMPLE_PROJECT_NOTIFICATION_SETTINGS } from '@/constants/exampleConstant';

interface NotificationRowProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const NotificationRow = ({ label, checked, onCheckedChange }: NotificationRowProps) => {
  return (
    <div className="flex w-40 items-center justify-between gap-2 py-3">
      <span className="text-label-1 text-label-normal">{label}</span>
      <Switch
        size="small"
        checked={checked}
        onCheckedChange={onCheckedChange}
        sx={{
          '&[data-checked="true"]': {
            backgroundColor: 'var(--color-primary-40) !important',
          },
        }}
      />
    </div>
  );
};

export const NotificationsSettingsPanel = () => {
  const [meetingEnabled, setMeetingEnabled] = useState<boolean>(
    EXAMPLE_PROJECT_NOTIFICATION_SETTINGS.meetingEnabled,
  );
  const [nodeEnabled, setNodeEnabled] = useState<boolean>(
    EXAMPLE_PROJECT_NOTIFICATION_SETTINGS.nodeEnabled,
  );
  const [desktopEnabled, setDesktopEnabled] = useState<boolean>(
    EXAMPLE_PROJECT_NOTIFICATION_SETTINGS.channels.desktop,
  );
  const [emailEnabled, setEmailEnabled] = useState<boolean>(
    EXAMPLE_PROJECT_NOTIFICATION_SETTINGS.channels.email,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <NotificationRow
          label="회의 알림"
          checked={meetingEnabled}
          onCheckedChange={setMeetingEnabled}
        />
        <NotificationRow label="노드 알림" checked={nodeEnabled} onCheckedChange={setNodeEnabled} />
      </div>

      <div aria-hidden="true" className="bg-line-normal-normal h-px w-full" />

      <div className="flex items-center gap-10">
        <span className="text-label-1 text-static-black">알림 수신 방법</span>
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 py-3">
            <Checkbox
              size="small"
              checked={desktopEnabled}
              onCheckedChange={setDesktopEnabled}
              tight
            />
            <span className="text-caption-1 text-label-normal">데스크톱</span>
          </label>
          <label className="flex items-center gap-2 py-3">
            <Checkbox size="small" checked={emailEnabled} onCheckedChange={setEmailEnabled} tight />
            <span className="text-caption-1 text-label-normal">이메일</span>
          </label>
        </div>
      </div>
    </div>
  );
};

NotificationsSettingsPanel.displayName = 'NotificationsSettingsPanel';
