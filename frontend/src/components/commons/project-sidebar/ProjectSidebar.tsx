'use client';

import {
  IconBell,
  IconChevronDoubleLeft,
  IconCompany,
  IconLeftSide,
  IconSearch,
  IconSetting,
} from '@wanteddev/wds-icon';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { EXAMPLE_PROJECT_SIDEBAR_PROFILE } from '@/constants/exampleConstant';
import { cn } from '@/utils/cn';

import { SidebarMenuButton } from './SidebarMenuButton';
import { UserProfileButton } from './UserProfileButton';

const SIDEBAR_EXPANDED_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 56;
const SIDEBAR_TRANSITION_DURATION = 0.24;
const SIDEBAR_LABEL_TRANSITION_DURATION = 0.16;

interface ProjectSidebarProps {
  projectName?: string;
  userName?: string;
  userEmail?: string;
  onSearchClick?: () => void;
  onInboxClick?: () => void;
  onSettingClick?: () => void;
  onProfileClick?: () => void;
}

export const ProjectSidebar = ({
  projectName = EXAMPLE_PROJECT_SIDEBAR_PROFILE.projectName,
  userName = EXAMPLE_PROJECT_SIDEBAR_PROFILE.userName,
  userEmail = EXAMPLE_PROJECT_SIDEBAR_PROFILE.userEmail,
  onSearchClick,
  onInboxClick,
  onSettingClick,
  onProfileClick,
}: ProjectSidebarProps) => {
  const pathname = usePathname();
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);
  const isProjectSelectionPage = pathname === '/projects';
  const isCollapsed = isProjectSelectionPage || isCollapsedInternal;
  const [isCollapseSettled, setIsCollapseSettled] = useState(true);
  const shouldUseCollapsedLayout = isCollapsed && isCollapseSettled;

  const handleToggleCollapsed = () => {
    setIsCollapsedInternal((prev) => {
      const nextIsCollapsed = !prev;
      setIsCollapseSettled(!nextIsCollapsed);
      return nextIsCollapsed;
    });
  };

  return (
    <motion.aside
      className="h-screen shrink-0 overflow-hidden border-r border-line-normal-neutral bg-background-normal-alternative px-2.5 py-1"
      initial={false}
      animate={{
        width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
      }}
      transition={{ duration: SIDEBAR_TRANSITION_DURATION, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        if (isCollapsed) {
          setIsCollapseSettled(true);
        }
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-2.5">
          <div
            className={cn(
              'border-b border-line-normal-neutral',
              shouldUseCollapsedLayout
                ? 'flex flex-col items-center justify-center gap-2 py-3.5'
                : 'flex items-center justify-between py-3.5 pl-1',
            )}
          >
            <div
              className={cn(
                'flex items-center',
                shouldUseCollapsedLayout ? 'w-full justify-center gap-0' : 'gap-2',
              )}
            >
              <div className="relative flex items-center justify-center">
                <div className="relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line-solid-normal bg-cool-neutral-96">
                  <IconCompany className="h-4 w-4 text-static-white" aria-hidden="true" />
                </div>
              </div>
              {projectName && (
                <motion.div
                  initial={false}
                  animate={{
                    maxWidth: isCollapsed ? 0 : 128,
                    opacity: isCollapsed ? 0 : 1,
                  }}
                  transition={{ duration: SIDEBAR_LABEL_TRANSITION_DURATION, ease: 'easeInOut' }}
                  className="overflow-hidden whitespace-nowrap text-center text-body-2 font-medium text-label-alternative"
                >
                  {projectName}
                </motion.div>
              )}
            </div>

            {!isCollapsed && !isProjectSelectionPage && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className="grid h-6 w-6 place-items-center rounded-md text-material-dimmer hover:bg-fill-alternative hover:text-label-neutral"
                aria-label="사이드바 접기"
              >
                <IconLeftSide className="h-4 w-4 rotate-0 transition-transform" aria-hidden="true" />
              </button>
            )}
            {shouldUseCollapsedLayout && !isProjectSelectionPage && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className="flex h-9 w-full items-center justify-center overflow-hidden rounded-md px-2.5 py-2.5 text-material-dimmer hover:bg-fill-alternative"
                aria-label="사이드바 펼치기"
              >
                <IconChevronDoubleLeft className="h-3 w-3 rotate-180" aria-hidden="true" />
              </button>
            )}
          </div>

          {!isProjectSelectionPage && (
            <nav className={cn('flex flex-col gap-1', isCollapsed && 'items-start')}>
              <SidebarMenuButton
                icon={IconSearch}
                isCollapsed={isCollapsed}
                label="검색"
                labelWidth={48}
                labelTransitionDuration={SIDEBAR_LABEL_TRANSITION_DURATION}
                onClick={onSearchClick}
              />
              <SidebarMenuButton
                icon={IconBell}
                isCollapsed={isCollapsed}
                label="수신함"
                labelWidth={64}
                badgeText="+99"
                labelTransitionDuration={SIDEBAR_LABEL_TRANSITION_DURATION}
                onClick={onInboxClick}
              />
              <SidebarMenuButton
                icon={IconSetting}
                isCollapsed={isCollapsed}
                label="설정"
                labelWidth={48}
                labelTransitionDuration={SIDEBAR_LABEL_TRANSITION_DURATION}
                onClick={onSettingClick}
              />
            </nav>
          )}
        </div>

        <div className="w-full bg-neutral-99">
          <UserProfileButton
            isCollapsed={isCollapsed}
            userName={userName}
            userEmail={userEmail}
            onClick={onProfileClick}
          />
        </div>
      </div>
    </motion.aside>
  );
};
