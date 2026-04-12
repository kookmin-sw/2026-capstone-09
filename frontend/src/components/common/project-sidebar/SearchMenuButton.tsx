import { IconSearch } from '@wanteddev/wds-icon';
import { SidebarMenuButton } from './SidebarMenuButton';

interface SearchMenuButtonProps {
  isCollapsed: boolean;
}

export const SearchMenuButton = ({ isCollapsed }: SearchMenuButtonProps) => {
  return (
    <SidebarMenuButton icon={IconSearch} isCollapsed={isCollapsed} label="검색" labelWidth={48} />
  );
};
