import { IconBell } from '@wanteddev/wds-icon';
import { SidebarMenuButton } from './SidebarMenuButton';

interface AlarmMenuButtonProps {
  isCollapsed: boolean;
}

export const AlarmMenuButton = ({ isCollapsed }: AlarmMenuButtonProps) => {
  return (
    <SidebarMenuButton
      icon={IconBell}
      isCollapsed={isCollapsed}
      label="수신함"
      labelWidth={64}
      badgeText="+99"
    />
  );
};
