'use client';

import {
  IconChevronDoubleLeft,
  IconCompany,
  IconLeftSide,
} from '@wanteddev/wds-icon';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { AlarmMenuButton } from './AlarmMenuButton';
import { ProjectSettingMenuButton } from './ProjectSettingMenuButton';
import { SearchMenuButton } from './SearchMenuButton';
import { UserProfileButton } from './UserProfileButton';

interface ProjectSidebarProps {
  projectName?: string;
  userName?: string;
  userEmail?: string;
}

const DEFAULT_PROJECT_NAME = '플로밋 기획';
const DEFAULT_USER_NAME = '황수민';
const DEFAULT_USER_EMAIL = 'tnals655@naver.com';

const SIDEBAR_EXPANDED_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 56;

export const ProjectSidebar = ({
  projectName = DEFAULT_PROJECT_NAME,
  userName = DEFAULT_USER_NAME,
  userEmail = DEFAULT_USER_EMAIL,
}: ProjectSidebarProps) => {
  const pathname = usePathname();
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);

  const sidebarMode = useMemo(() => {
    if (pathname === '/projects') return 'projectSelect';
    if (pathname?.startsWith('/projects/')) return 'projectDetail';
    return 'projectDetail';
  }, [pathname]);

  const shouldShowProjectMenus = sidebarMode === 'projectDetail';
  const isCollapsible = sidebarMode !== 'projectSelect';
  const isCollapsed = isCollapsible ? isCollapsedInternal : true;
  const [isCollapseSettled, setIsCollapseSettled] = useState(true);
  const shouldUseCollapsedLayout = isCollapsed && isCollapseSettled;

  useEffect(() => {
    if (!isCollapsed) {
      const id = window.setTimeout(() => {
        setIsCollapseSettled(true);
      }, 0);
      return () => window.clearTimeout(id);
    }

    const idFalse = window.setTimeout(() => {
      setIsCollapseSettled(false);
    }, 0);
    const idTrue = window.setTimeout(() => {
      setIsCollapseSettled(true);
    }, 240);

    return () => {
      window.clearTimeout(idFalse);
      window.clearTimeout(idTrue);
    };
  }, [isCollapsed]);

  const handleToggleCollapsed = () => {
    if (!isCollapsible) return;
    setIsCollapsedInternal((prev) => !prev);
  };

  return (
    <motion.aside
      className="h-screen shrink-0 overflow-hidden border-r border-[rgba(112,115,124,0.16)] bg-[rgba(247,247,248,1)] px-4 py-2"
      initial={false}
      animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH }}
      transition={{ duration: 0.24, ease: 'easeInOut' }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div
            className={`border-b border-[rgba(112,115,124,0.16)] ${
              shouldUseCollapsedLayout
                ? 'flex flex-col items-center justify-center gap-3 pt-5 pb-2'
                : 'flex items-center justify-between py-5 pl-2'
            }`}
          >
            <div className={`flex items-center ${shouldUseCollapsedLayout ? 'w-full justify-center gap-0' : 'gap-3'}`}>
              <div className="relative flex items-center justify-center">
                <div className="relative flex aspect-square h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#E8E9EA] outline outline-1 outline-[#DEE0E1] outline-offset-[-1px]">
                  <IconCompany className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
              <motion.div
                initial={false}
                animate={{
                  maxWidth: isCollapsed ? 0 : 128,
                  opacity: isCollapsed ? 0 : 1,
                }}
                transition={{ duration: 0.16, ease: 'easeInOut' }}
                className="overflow-hidden whitespace-nowrap text-center text-[15px] font-medium leading-[22.01px] tracking-[0.14px] text-[#686868]"
              >
                {projectName}
              </motion.div>
            </div>

            {isCollapsible && !isCollapsed && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className="grid h-[18px] w-[18px] place-items-center text-[rgba(23,23,25,0.52)] hover:text-[rgba(23,23,25,0.72)]"
                aria-label="사이드바 접기"
              >
                <IconLeftSide
                  className="h-[18px] w-[18px] transition-transform rotate-0"
                  aria-hidden="true"
                />
              </button>
            )}
            {isCollapsible && shouldUseCollapsedLayout && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className="flex h-14 w-full items-center justify-center overflow-hidden rounded-[6px] px-4 py-4 text-[rgba(23,23,25,0.52)] hover:bg-[rgba(112,115,124,0.05)]"
                aria-label="사이드바 펼치기"
              >
                <IconChevronDoubleLeft
                  className="h-[18px] w-[18px] rotate-180"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>

          {shouldShowProjectMenus && (
            <nav className={`flex flex-col gap-2 ${isCollapsed ? 'items-start' : ''}`}>
              <SearchMenuButton isCollapsed={isCollapsed} />
              <AlarmMenuButton isCollapsed={isCollapsed} />
              <ProjectSettingMenuButton isCollapsed={isCollapsed} />
            </nav>
          )}
        </div>

        <div className="w-full bg-[#F6F6F6]">
          <UserProfileButton isCollapsed={isCollapsed} userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </motion.aside>
  );
};