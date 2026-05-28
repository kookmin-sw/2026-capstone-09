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
import { prefetchNotificationSetting, useNotificationListQuery } from '@/queries/notification';
import { useProjectListQuery, useProjectQuery } from '@/queries/project';
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
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('sidebar-collapsed') === 'true',
  );
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [projectImgError, setProjectImgError] = useState(false);
  const isProjectSelectionPage = pathname === '/projects';

  // 프로젝트 정보 — Tanstack Query
  const { data: projectData } = useProjectQuery(isProjectIdValid ? (projectId as number) : 0);
  const { data: projectListData } = useProjectListQuery({ sort: 'LATEST', search: '' });

  // 사용자 정보 — API(getMe) 우선, localStorage 폴백
  const { data: currentUser } = useCurrentUserQuery();
  const storedUser = userStorage.get();

  // 읽지 않은 알림 개수 — 현재 프로젝트로 필터된 알림 목록에서 직접 파생한다.
  // 글로벌 unread-count API는 다른 프로젝트의 알림까지 합산하므로 사용하지 않는다.
  const { data: projectNotifications = [] } = useNotificationListQuery(
    isProjectIdValid ? (projectId as number) : 0,
  );
  const unreadCount = projectNotifications.filter((n) => n.isRead === false).length;
  // SSE로 새로 수신한 알림 여부 (알림창 열면 초기화)
  const [hasNewSseNotification, setHasNewSseNotification] = useState(false);

  useEffect(() => {
    if (!isProjectIdValid || projectId === undefined) return;

    const token = authStorage.getAccess();
    if (!token) return;

    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');
    const subscribeUrl = new URL(`${baseUrl}/v1/notifications/subscribe`, window.location.origin);
    subscribeUrl.searchParams.set('projectId', String(projectId));

    // 서버는 30분 후 연결을 정상 종료하고, 그 외 네트워크 끊김/절전 등으로도 끊길 수 있다.
    // fetch 기반 SSE는 EventSource와 달리 자동 재연결이 없으므로 백오프로 직접 재연결한다.
    const INITIAL_DELAY = 1000;
    const MAX_DELAY = 30_000;
    // 서버 heartbeat가 30초 주기이므로, 60초간 아무 신호가 없으면 죽은 연결로 보고 강제 재연결.
    const HEARTBEAT_TIMEOUT = 60_000;

    let stopped = false;
    let controller: AbortController | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
    let retryDelay = INITIAL_DELAY;

    const clearWatchdog = () => {
      if (watchdogTimer !== null) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
    };

    const armWatchdog = () => {
      clearWatchdog();
      watchdogTimer = setTimeout(() => controller?.abort(), HEARTBEAT_TIMEOUT);
    };

    const scheduleReconnect = () => {
      if (stopped) return;
      reconnectTimer = setTimeout(() => void connect(), retryDelay);
      retryDelay = Math.min(retryDelay * 2, MAX_DELAY);
    };

    const connect = async () => {
      if (stopped) return;
      controller = new AbortController();
      try {
        const response = await fetch(subscribeUrl, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (response.ok && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let currentEventType: string | null = null;
          armWatchdog();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            retryDelay = INITIAL_DELAY; // 정상 수신 → 백오프 리셋
            armWatchdog(); // 신호 받음 → watchdog 갱신
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (line.startsWith('event:')) {
                currentEventType = line.slice('event:'.length).trim();
              } else if (line.startsWith('data:')) {
                // 'notification' 이벤트만 처리 (connect, heartbeat 등은 무시)
                if (currentEventType === 'notification') {
                  setHasNewSseNotification(true);
                  // 목록 캐시를 무효화해 새 알림이 반영되도록 한다.
                  // 뱃지 카운트는 목록에서 파생되므로 별도의 unread-count 캐시 갱신은 불필요.
                  void queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
                }
              } else if (line.trim() === '') {
                // 빈 줄은 메시지 구분자 — event 타입 초기화
                currentEventType = null;
              }
            }
          }
        }
      } catch {
        // abort 또는 네트워크 오류 — 아래 재연결로 처리
      } finally {
        clearWatchdog();
      }

      // 정상 종료(타임아웃)·오류·watchdog abort 모두 재연결 (effect cleanup 제외)
      scheduleReconnect();
    };

    void connect();
    return () => {
      stopped = true;
      controller?.abort();
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      clearWatchdog();
    };
  }, [isProjectIdValid, projectId, queryClient]);

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
    if (!isAlarmModalOpen && !isProjectMenuOpen) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsAlarmModalOpen(false);
        setIsProjectMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isAlarmModalOpen, isProjectMenuOpen]);

  const handleToggleCollapsed = () => {
    setIsCollapsedInternal((prev) => {
      const nextIsCollapsed = !prev;
      localStorage.setItem('sidebar-collapsed', String(nextIsCollapsed));
      setIsCollapseSettled(!nextIsCollapsed);
      if (nextIsCollapsed) {
        setIsAlarmModalOpen(false);
        setIsProjectMenuOpen(false);
      }
      return nextIsCollapsed;
    });
  };

  const handleAlarmModalToggle = () => {
    setIsProjectMenuOpen(false);
    setIsAlarmModalOpen((prev) => {
      const nextOpen = !prev;
      if (nextOpen) setHasNewSseNotification(false);
      return nextOpen;
    });
    onInboxClick?.();
  };

  const handleSearchClick = () => {
    setIsProjectMenuOpen(false);
    onSearchClick?.();
    if (!isProjectIdValid || projectId === undefined) return;
    openModal({
      variant: 'compact',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: <SearchModalContent projectId={projectId} onResultClick={() => closeModal()} />,
    });
  };

  const handleSettingClick = () => {
    setIsProjectMenuOpen(false);
    onSettingClick?.();
    if (!isProjectIdValid || projectId === undefined) return;
    // 알림 탭 토글 깜빡임 방지를 위해 모달 열기 전에 알림 설정을 미리 받아둔다.
    void prefetchNotificationSetting(queryClient, projectId);
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
    setIsProjectMenuOpen(false);
    const targetId = notification.targetId;
    const notifProjectId = notification.projectId;
    if (!targetId || !notifProjectId) return;
    router.push(`/projects/${notifProjectId}?openNode=${targetId}`);
  };

  const handleProfileClick = () => {
    setIsProjectMenuOpen(false);
    onProfileClick?.();
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: <AccountSettingsModalContent onClose={closeModal} />,
    });
  };

  const handleProjectListClick = () => {
    setIsProjectMenuOpen(false);
    router.push('/projects');
  };

  const handleProjectMenuToggle = () => {
    setIsAlarmModalOpen(false);
    setIsProjectMenuOpen((prev) => !prev);
  };

  const handleProjectMove = (nextProjectId?: number) => {
    if (!nextProjectId) return;
    setIsProjectMenuOpen(false);
    router.push(`/projects/${nextProjectId}`);
  };

  return (
    <div ref={containerRef} className="relative z-20 flex shrink-0">
      <motion.aside
        className="border-line-normal-neutral bg-background-normal-alternative font-pretendard text-body-2 text-label-alternative relative z-10 h-screen shrink-0 overflow-visible border-r px-2.5 pt-2 pb-0"
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
              <button
                type="button"
                onClick={handleProjectMenuToggle}
                className={cn(
                  'hover:bg-fill-alternative flex appearance-none items-center rounded-md border-none bg-transparent text-left transition-colors',
                  shouldUseCollapsedLayout ? 'w-full justify-center gap-0' : 'gap-2',
                )}
                aria-expanded={isProjectMenuOpen}
                aria-haspopup="menu"
                aria-label="프로젝트 메뉴 열기"
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
              </button>

              {isProjectMenuOpen && (
                <div
                  role="menu"
                  className="border-line-normal-neutral bg-static-white shadow-normal-small absolute top-16 left-4 z-30 flex w-72 flex-col rounded-xl border py-2"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleProjectListClick}
                    className="group w-full bg-static-white px-2 py-0.5 text-left"
                  >
                    <span className="hover:bg-fill-alternative text-label-1 text-label-normal block rounded-lg px-3 py-1.5 font-medium">
                      목록으로 돌아가기
                    </span>
                  </button>

                  <div className="bg-line-normal-neutral my-0.5 h-px" />

                  <div className="custom-scrollbar max-h-60 overflow-y-auto">
                    {(projectListData?.content ?? []).map((project) => (
                      <button
                        key={project.projectId}
                        type="button"
                        role="menuitem"
                        onClick={() => handleProjectMove(project.projectId)}
                        className="group w-full bg-static-white px-2 py-0.5 text-left"
                      >
                        <span
                          className={cn(
                            'hover:bg-fill-alternative flex items-center gap-3 rounded-lg px-3 py-1.5',
                            project.projectId === projectId
                              ? 'text-label-normal'
                              : 'text-label-alternative',
                          )}
                        >
                          <span className="border-line-solid-normal bg-cool-neutral-96 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                            {project.profileImageUrl ? (
                              <img
                                src={normalizeImageUrl(project.profileImageUrl)}
                                alt={project.name ?? '프로젝트'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <IconCompany
                                className="text-static-white h-4 w-4"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          <span className="text-label-2 truncate font-normal">{project.name}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
          />
        )}
      </AnimatePresence>
    </div>
  );
};
