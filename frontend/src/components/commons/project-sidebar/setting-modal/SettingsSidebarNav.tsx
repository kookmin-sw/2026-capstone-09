'use client';

import { IconBell, IconFolder, IconPersons } from '@wanteddev/wds-icon';
import type { ComponentType, SVGProps } from 'react';

import { cn } from '@/utils/cn';

import type { SettingsTab } from './types';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const TABS: readonly TabItem[] = [
  { id: 'project', label: '프로젝트', icon: IconFolder },
  { id: 'members', label: '구성원', icon: IconPersons },
  { id: 'notifications', label: '알림', icon: IconBell },
];

interface SettingsSidebarNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

/**
 * 설정 모달 좌측 탭 네비게이션.
 * 본문 패널들과 `activeTab` 상태를 공유한다.
 */
export const SettingsSidebarNav = ({ activeTab, onTabChange }: SettingsSidebarNavProps) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <h3 className="text-caption-1 text-static-black font-semibold">설정</h3>
      <nav className="flex flex-col gap-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-md border-none bg-transparent p-0 py-2 text-left',
                'text-label-neutral hover:text-label-normal',
                isActive && 'text-label-normal font-medium',
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6 shrink-0',
                  isActive ? 'text-label-normal' : 'text-label-alternative',
                )}
                aria-hidden="true"
              />
              <span className="text-body-1 flex-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

SettingsSidebarNav.displayName = 'SettingsSidebarNav';
