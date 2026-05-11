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
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { privateApi } from '@/api';
import { useErrorToast } from '@/hooks/useErrorToast';
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
  projectName: projectNameProp,
  userName: userNameProp,
  userEmail: userEmailProp,
  onSearchClick,
  onInboxClick,
  onSettingClick,
  onProfileClick,
}: ProjectSidebarProps) => {
  const pathname = usePathname();
  const params = useParams<{ projectId?: string }>();
  const projectIdRaw = params?.projectId;
  const projectId = projectIdRaw ? Number(projectIdRaw) : undefined;
  const isProjectIdValid = projectId !== undefined && !Number.isNaN(projectId);

  const showErrorToast = useErrorToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  // 사이드바가 직접 fetch 한 결과 — props 로 명시 전달된 값이 있으면 그 값을, 없으면 fetch 결과를 사용한다.
  const [fetchedProjectName, setFetchedProjectName] = useState<string | undefined>(undefined);
  const [me, setMe] = useState<{ nickname?: string; email?: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const isProjectSelectionPage = pathname === '/projects';

  // 프로젝트 이름 fetch — 라우트에 projectId 가 있을 때만.
  // setState 는 inline async 함수 안에서 호출해 `react-hooks/set-state-in-effect` 룰 회피.
  useEffect(() => {
    let cancelled = false;
    const fetchProjectName = async () => {
      if (!isProjectIdValid || projectId === undefined) {
        if (!cancelled) setFetchedProjectName(undefined);
        return;
      }
      try {
        const response = await privateApi.project.getProject(projectId);
        if (cancelled) return;
        setFetchedProjectName(response.data.data?.name);
      } catch (caught) {
        if (cancelled) return;
        showErrorToast(caught, '프로젝트 이름 조회에 실패했어요.');
      }
    };
    void fetchProjectName();
    return () => {
      cancelled = true;
    };
  }, [isProjectIdValid, projectId, showErrorToast]);

  // 내 계정 fetch — 사이드바 마운트 시 한 번.
  useEffect(() => {
    let cancelled = false;
    const fetchMe = async () => {
      try {
        const response = await privateApi.user.getMe();
        if (cancelled) return;
        const data = response.data.data;
        setMe({ nickname: data?.nickname, email: data?.email });
      } catch (caught) {
        if (cancelled) return;
        showErrorToast(caught, '내 정보 조회에 실패했어요.');
      }
    };
    void fetchMe();
    return () => {
      cancelled = true;
    };
  }, [showErrorToast]);

  // 읽지 않은 알림 개수 fetch — 알림 모달 열고 닫을 때마다 재조회해 배지 동기화.
  useEffect(() => {
    let cancelled = false;
    const fetchUnreadCount = async () => {
      try {
        const response = await privateApi.notification.getUnreadCount();
        if (cancelled) return;
        setUnreadCount(response.data.data?.unreadCount ?? 0);
      } catch (caught) {
        if (cancelled) return;
        showErrorToast(caught, '알림 개수를 불러오지 못했어요.');
      }
    };
    void fetchUnreadCount();
    return () => {
      cancelled = true;
    };
  }, [isAlarmModalOpen, showErrorToast]);

  // prop > fetch > 빈 문자열 우선순위로 합성.
  const projectName = projectNameProp ?? fetchedProjectName ?? '';
  const userName = userNameProp ?? me?.nickname ?? '';
  const userEmail = userEmailProp ?? me?.email ?? '';
  const isCollapsed = isProjectSelectionPage || isCollapsedInternal;
  const [isCollapseSettled, setIsCollapseSettled] = useState(true);
  const shouldUseCollapsedLayout = isCollapsed && isCollapseSettled;
  const badgeText = unreadCount > 99 ? '+99' : unreadCount > 0 ? `${unreadCount}` : undefined;

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
    <div ref={containerRef} className="relative z-20 flex shrink-0">
      <motion.aside
        className="border-line-normal-neutral bg-background-normal-alternative font-pretendard text-body-2 text-label-alternative relative z-10 h-screen shrink-0 overflow-hidden border-r px-2.5 pt-2 pb-0"
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
                'border-line-normal-neutral border-b',
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
                  <div className="border-line-solid-normal bg-cool-neutral-96 relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                    <IconCompany className="text-static-white h-4 w-4" aria-hidden="true" />
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
                    className="text-body-2 text-label-alternative overflow-hidden text-center font-medium whitespace-nowrap"
                  >
                    {projectName}
                  </motion.div>
                )}
              </div>

              {!isCollapsed && !isProjectSelectionPage && (
                <button
                  type="button"
                  onClick={handleToggleCollapsed}
                  className="text-material-dimmer hover:bg-fill-alternative hover:text-label-neutral grid h-6 w-6 appearance-none place-items-center rounded-md border-none bg-transparent leading-normal"
                  aria-label="사이드바 접기"
                >
                  <IconLeftSide
                    className="h-5 w-5 rotate-0 transition-transform"
                    aria-hidden="true"
                  />
                </button>
              )}
              {shouldUseCollapsedLayout && !isProjectSelectionPage && (
                <button
                  type="button"
                  onClick={handleToggleCollapsed}
                  className="text-material-dimmer hover:bg-fill-alternative flex h-7 w-full appearance-none items-center justify-center overflow-hidden rounded-md border-none bg-transparent px-2 leading-normal"
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
                  badgeText={badgeText}
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

          <div className="bg-neutral-99 w-full">
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
        {isAlarmModalOpen && !isCollapsed && (
          <SidebarAlarmModal onClose={() => setIsAlarmModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
