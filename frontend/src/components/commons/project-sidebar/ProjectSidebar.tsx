'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  IconBell,
  IconChevronDoubleLeft,
  IconCompany,
  IconLeftSide,
  IconSearch,
  IconSetting,
} from '@wanteddev/wds-icon';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { authStorage } from '@/api/authStorage';
import { userStorage } from '@/api/userStorage';
import { useModal } from '@/components/commons/modal/ModalContext';
import { notificationKeys } from '@/queries/keys/notificationKeys';
import { useUnreadCountQuery } from '@/queries/notification';
import { useProjectQuery } from '@/queries/project';
import { useCurrentUserQuery } from '@/queries/user';
import { cn } from '@/utils/cn';

import { AccountSettingsModalContent } from './account-settings';
import { SearchModalContent } from './SearchModalContent';
import { SettingsModalContent } from './setting-modal';
import { SidebarAlarmModal } from './SidebarAlarmModal';
import { SidebarMenuButton } from './SidebarMenuButton';
import { UserProfileButton } from './UserProfileButton';

const SIDEBAR_EXPANDED_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 56;
const SIDEBAR_TRANSITION_DURATION = 0.24;
const SIDEBAR_LABEL_TRANSITION_DURATION = 0.16;

const normalizeImageUrl = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  if (/^(https?:)?\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

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
  const router = useRouter();
  const params = useParams<{ projectId?: string }>();
  const projectIdRaw = params?.projectId;
  const projectId = projectIdRaw ? Number(projectIdRaw) : undefined;
  const isProjectIdValid = projectId !== undefined && !Number.isNaN(projectId);
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [projectImgError, setProjectImgError] = useState(false);
  const isProjectSelectionPage = pathname === '/projects';

  // 프로젝트 정보 — Tanstack Query
  const { data: projectData } = useProjectQuery(isProjectIdValid ? (projectId as number) : 0);

  // 사용자 정보 — API(getMe) 우선, localStorage 폴백
  const { data: currentUser } = useCurrentUserQuery();
  const storedUser = userStorage.get();

  // 읽지 않은 알림 개수 — 최초 1회 fetch + SSE로 +1씩 누적
  const { data: initialUnreadCount = 0 } = useUnreadCountQuery();
  const [sseExtra, setSseExtra] = useState(0);
  const unreadCount = initialUnreadCount + sseExtra;
  // SSE로 새로 수신한 알림 여부 (알림창 열면 초기화)
  const [hasNewSseNotification, setHasNewSseNotification] = useState(false);

  useEffect(() => {
    if (!isProjectIdValid || projectId === undefined) return;

    const token = authStorage.getAccess();
    if (!token) return;

    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');
    const controller = new AbortController();
    const subscribeUrl = new URL(`${baseUrl}/v1/notifications/subscribe`, window.location.origin);
    subscribeUrl.searchParams.set('projectId', String(projectId));

    const connect = async () => {
      try {
        const response = await fetch(subscribeUrl, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok || !response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentEventType: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (line.startsWith('event:')) {
              currentEventType = line.slice('event:'.length).trim();
            } else if (line.startsWith('data:')) {
              // 'notification' 이벤트만 카운트 (connected, heartbeat 등은 무시)
              if (currentEventType === 'notification') {
                setSseExtra((prev) => prev + 1);
                setHasNewSseNotification(true);
              }
            } else if (line === '') {
              // 빈 줄은 메시지 구분자 — event 타입 초기화
              currentEventType = null;
            }
          }
        }
      } catch {
        // SSE 연결 종료 또는 오류 — 무시
      }
    };

    void connect();
    return () => { controller.abort(); };
  }, [isProjectIdValid, projectId]);

  // prop > query > storage > 빈 문자열 우선순위로 합성
  const projectName = projectNameProp ?? projectData?.name ?? '';
  const projectImageUrl = normalizeImageUrl(projectData?.profileImageUrl);
  const userName = userNameProp ?? currentUser?.nickname ?? storedUser?.nickname ?? '';
  const userEmail = userEmailProp ?? currentUser?.email ?? storedUser?.email ?? '';
  const profileImageUrl = normalizeImageUrl(
    currentUser?.profileImageUrl ?? storedUser?.profileImageUrl,
  );
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
    setIsAlarmModalOpen((prev) => {
      const nextOpen = !prev;
      if (nextOpen) setHasNewSseNotification(false);
      return nextOpen;
    });
    onInboxClick?.();
  };

  const handleSearchClick = () => {
    onSearchClick?.();
    if (!isProjectIdValid || projectId === undefined) return;
    openModal({
      variant: 'compact',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <SearchModalContent projectId={projectId} onResultClick={() => closeModal()} />
      ),
    });
  };

  const handleSettingClick = () => {
    onSettingClick?.();
    if (!isProjectIdValid || projectId === undefined) return;
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: <SettingsModalContent projectId={projectId} onClose={closeModal} />,
    });
  };

  const handleNotificationClick = (notification: import('@/api/Api').NotificationSummaryResponse) => {
    // 알림창 닫기
    setIsAlarmModalOpen(false);
    const targetId = notification.targetId;
    const notifProjectId = notification.projectId;
    if (!targetId || !notifProjectId) return;
    router.push(`/projects/${notifProjectId}?openNode=${targetId}`);
  };

  const handleProfileClick = () => {
    onProfileClick?.();
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: <AccountSettingsModalContent onClose={closeModal} />,
    });
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
                    {projectImageUrl && !projectImgError ? (
                      <img
                        src={projectImageUrl}
                        alt={projectName}
                        className="h-full w-full object-cover"
                        onError={() => setProjectImgError(true)}
                      />
                    ) : (
                      <IconCompany className="text-static-white h-4 w-4" aria-hidden="true" />
                    )}
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
                  onClick={handleSearchClick}
                />
                <SidebarMenuButton
                  icon={IconBell}
                  isCollapsed={isCollapsed}
                  label="수신함"
                  labelWidth={64}
                  badgeText={badgeText}
                  showDot={hasNewSseNotification}
                  labelTransitionDuration={SIDEBAR_LABEL_TRANSITION_DURATION}
                  onClick={handleAlarmModalToggle}
                />
                <SidebarMenuButton
                  icon={IconSetting}
                  isCollapsed={isCollapsed}
                  label="설정"
                  labelWidth={48}
                  labelTransitionDuration={SIDEBAR_LABEL_TRANSITION_DURATION}
                  onClick={handleSettingClick}
                />
              </nav>
            )}
          </div>

          <div className="bg-neutral-99 w-full">
            <UserProfileButton
              isCollapsed={isCollapsed}
              userName={userName}
              userEmail={userEmail}
              profileImageUrl={profileImageUrl}
              onClick={handleProfileClick}
            />
          </div>
        </div>
      </motion.aside>
      <AnimatePresence>
        {isAlarmModalOpen && !isCollapsed && isProjectIdValid && projectId !== undefined && (
          <SidebarAlarmModal
            projectId={projectId}
            onClose={() => setIsAlarmModalOpen(false)}
            onNotificationClick={handleNotificationClick}
            onListLoaded={(unreadInList) => {
              // 알림 리스트 기반 실제 unread 개수로 캐시 동기화 + SSE 누적값 초기화
              queryClient.setQueryData(notificationKeys.unreadCount(), unreadInList);
              setSseExtra(0);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
