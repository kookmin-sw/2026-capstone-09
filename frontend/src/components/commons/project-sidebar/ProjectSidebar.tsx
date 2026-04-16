'use client';

import {
  IconBell,
  IconChevronDoubleLeft,
  IconCompany,
  IconLeftSide,
  IconSearch,
  IconSetting,
} from '@wanteddev/wds-icon';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { EXAMPLE_PROJECT_SIDEBAR_PROFILE } from '@/constants/exampleConstant';
import { cn } from '@/utils/cn';

import { SidebarAlarmModal } from './SidebarAlarmModal';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const isProjectSelectionPage = pathname === '/projects';
  const isCollapsed = isProjectSelectionPage || isCollapsedInternal;
  const [isCollapseSettled, setIsCollapseSettled] = useState(true);
  const shouldUseCollapsedLayout = isCollapsed && isCollapseSettled;

  useEffect(() => {
    if (!isAlarmModalOpen) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsAlarmModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isAlarmModalOpen]);

  const handleToggleCollapsed = () => {
    setIsCollapsedInternal((prev) => {
      const nextIsCollapsed = !prev;
      setIsCollapseSettled(!nextIsCollapsed);
      if (nextIsCollapsed) {
        setIsAlarmModalOpen(false);
      }
      return nextIsCollapsed;
    });
  };

  const handleAlarmModalToggle = () => {
    setIsAlarmModalOpen((prev) => !prev);
    onInboxClick?.();
  };

  return (
    <div ref={containerRef} className="relative flex shrink-0">
      <motion.aside
        className="relative z-10 h-screen shrink-0 overflow-hidden border-r border-line-normal-neutral bg-background-normal-alternative px-2.5 pt-2 pb-0 font-pretendard text-body-2 text-label-alternative"
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
          <div className={cn('flex flex-col', isCollapsed ? 'gap-1' : 'gap-2')}>
            <div
              className={cn(
                'border-b border-line-normal-neutral',
                shouldUseCollapsedLayout
                  ? 'flex flex-col items-center justify-center gap-3 py-2'
                  : 'flex items-center justify-between pt-2 pb-4 pl-1.5',
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
                  className="grid h-6 w-6 appearance-none place-items-center rounded-md border-none bg-transparent leading-normal text-material-dimmer hover:bg-fill-alternative hover:text-label-neutral"
                  aria-label="사이드바 접기"
                >
                  <IconLeftSide className="h-5 w-5 rotate-0 transition-transform" aria-hidden="true" />
                </button>
              )}
              {shouldUseCollapsedLayout && !isProjectSelectionPage && (
                <button
                  type="button"
                  onClick={handleToggleCollapsed}
                  className="flex h-7 w-full appearance-none items-center justify-center overflow-hidden rounded-md border-none bg-transparent px-2 leading-normal text-material-dimmer hover:bg-fill-alternative"
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
                  onClick={handleAlarmModalToggle}
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
      <AnimatePresence>
        {isAlarmModalOpen && !isCollapsed && <SidebarAlarmModal onClose={() => setIsAlarmModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};
