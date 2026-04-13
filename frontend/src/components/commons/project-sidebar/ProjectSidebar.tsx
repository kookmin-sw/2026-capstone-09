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
import { useState } from 'react';

import { EXAMPLE_PROJECT_SIDEBAR_PROFILE } from '@/constants/exampleConstant';
import { cn } from '@/utils/cn';

import { SidebarMenuButton } from './SidebarMenuButton';
import { UserProfileButton } from './UserProfileButton';

const SIDEBAR_EXPANDED_WIDTH = '13.75rem';
const SIDEBAR_COLLAPSED_WIDTH = '3.5rem';
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
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);
  const isCollapsed = isCollapsedInternal;
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
      className="h-screen shrink-0 overflow-hidden border-r border-line-normal-neutral bg-background-normal-alternative px-[0.625rem] py-[0.3125rem]"
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
        <div className="flex flex-col gap-[0.625rem]">
          <div
            className={cn(
              'border-b border-line-normal-neutral',
              shouldUseCollapsedLayout
                ? 'flex flex-col items-center justify-center gap-[0.46875rem] pb-[0.3125rem] pt-[0.78125rem]'
                : 'flex items-center justify-between py-[0.78125rem] pl-[0.3125rem]',
            )}
          >
            <div
              className={cn(
                'flex items-center',
                shouldUseCollapsedLayout ? 'w-full justify-center gap-0' : 'gap-[0.46875rem]',
              )}
            >
              <div className="relative flex items-center justify-center">
                <div className="relative flex aspect-square h-[1.5625rem] w-[1.5625rem] shrink-0 items-center justify-center overflow-hidden rounded-md bg-cool-neutral-96 outline outline-1 outline-line-solid-normal outline-offset-[-1px]">
                  <IconCompany className="h-[0.9375rem] w-[0.9375rem] text-static-white" aria-hidden="true" />
                </div>
              </div>
              {projectName && (
                <motion.div
                  initial={false}
                  animate={{
                    maxWidth: isCollapsed ? 0 : '8rem',
                    opacity: isCollapsed ? 0 : 1,
                  }}
                  transition={{ duration: SIDEBAR_LABEL_TRANSITION_DURATION, ease: 'easeInOut' }}
                  className="overflow-hidden whitespace-nowrap text-center text-body-2 font-medium text-label-alternative"
                >
                  {projectName}
                </motion.div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className="grid h-[0.78125rem] w-[0.78125rem] place-items-center text-material-dimmer hover:text-label-neutral"
                aria-label="사이드바 접기"
              >
                <IconLeftSide className="h-[0.78125rem] w-[0.78125rem] rotate-0 transition-transform" aria-hidden="true" />
              </button>
            )}
            {shouldUseCollapsedLayout && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className="flex h-[2.1875rem] w-full items-center justify-center overflow-hidden rounded-md px-[0.625rem] py-[0.625rem] text-material-dimmer hover:bg-fill-alternative"
                aria-label="사이드바 펼치기"
              >
                <IconChevronDoubleLeft className="h-[0.78125rem] w-[0.78125rem] rotate-180" aria-hidden="true" />
              </button>
            )}
          </div>

          <nav className={cn('flex flex-col gap-[0.3125rem]', isCollapsed && 'items-start')}>
            <SidebarMenuButton
              icon={IconSearch}
              isCollapsed={isCollapsed}
              label="검색"
              labelWidth="3rem"
              labelTransitionDuration={SIDEBAR_LABEL_TRANSITION_DURATION}
              onClick={onSearchClick}
            />
            <SidebarMenuButton
              icon={IconBell}
              isCollapsed={isCollapsed}
              label="수신함"
              labelWidth="4rem"
              badgeText="+99"
              labelTransitionDuration={SIDEBAR_LABEL_TRANSITION_DURATION}
              onClick={onInboxClick}
            />
            <SidebarMenuButton
              icon={IconSetting}
              isCollapsed={isCollapsed}
              label="설정"
              labelWidth="3rem"
              labelTransitionDuration={SIDEBAR_LABEL_TRANSITION_DURATION}
              onClick={onSettingClick}
            />
          </nav>
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
