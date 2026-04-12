import { IconSetting } from '@wanteddev/wds-icon';
import { SidebarMenuButton } from './SidebarMenuButton';

interface ProjectSettingMenuButtonProps {
  isCollapsed: boolean;
}

export const ProjectSettingMenuButton = ({ isCollapsed }: ProjectSettingMenuButtonProps) => {
  return (
    <SidebarMenuButton icon={IconSetting} isCollapsed={isCollapsed} label="설정" labelWidth={48} />
  );
};
