'use client';

import { IconChevronDoubleLeft, IconInbox } from '@wanteddev/wds-icon';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { privateApi } from '@/api';
import type { NotificationSummaryResponse } from '@/api/Api';
import { useErrorToast } from '@/hooks/useErrorToast';

import { SidebarAlarmModalItem } from './SidebarAlarmModalItem';

interface SidebarAlarmModalProps {
  projectId: number;
  onClose: () => void;
  onNotificationClick?: (notification: NotificationSummaryResponse) => void;
  /** 리스트 로드 완료 시 실제 unread 개수 동기화용 콜백 */
  onListLoaded?: (unreadCount: number) => void;
}

const sidebarVariants = {
  hidden: {
    x: '-100%',
  },
  visible: {
    x: 0,
    transition: {
      type: 'tween' as const,
      ease: [0.25, 1, 0.5, 1] as const,
      duration: 0.4,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      type: 'tween' as const,
      ease: [0.5, 0, 0.75, 0] as const,
      duration: 0.3,
    },
  },
};

const NOTIFICATION_TYPE_LABELS: Record<
  NonNullable<NotificationSummaryResponse['type']>,
  string
> = {
  MEETING_CREATED: '회의 생성',
  MEETING_INVITE: '회의 초대',
  MEETING_REMINDER: '회의 알림',
  MEETING_ENDED: '회의 종료',
  MEMBER_INVITE: '멤버 초대',
  NODE_ASSIGNED: '노드 담당자 배정',
  NODE_UPDATED: '노드 업데이트',
};

const formatNotificationTime = (createdAt?: string) => {
  if (!createdAt) return '';
  const notificationDate = new Date(createdAt);
  if (Number.isNaN(notificationDate.getTime())) return createdAt;
  const now = new Date();
  const diffInMs = now.getTime() - notificationDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${Math.max(diffInMinutes, 1)}분 전`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  return createdAt.slice(0, 10);
};

export const SidebarAlarmModal = ({
  projectId,
  onClose,
  onNotificationClick,
  onListLoaded,
}: SidebarAlarmModalProps) => {
  const showErrorToast = useErrorToast();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSummaryResponse[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchNotifications = async () => {
      try {
        const response = await privateApi.notification.getAllNotifications();
        if (cancelled) return;
        const items = (response.data.data?.content ?? []).filter(
          (notification) => notification.projectId === projectId,
        );
        setNotifications(items);
        // 실제 리스트 기준 unread 개수를 부모로 전달해 뱃지 동기화
        const unreadInList = items.filter((n) => n.isRead === false).length;
        onListLoaded?.(unreadInList);
      } catch (caught) {
        if (cancelled) return;
        showErrorToast(caught, '알림 목록을 불러오지 못했어요.');
      }
    };
    void fetchNotifications();
    return () => {
      cancelled = true;
    };
  }, [projectId, showErrorToast, onListLoaded]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setHasScrolled(event.currentTarget.scrollTop > 0);
  };

  return (
    <>
      <motion.div
        className="border-line-normal-neutral bg-static-white absolute top-0 left-full z-0 h-screen w-80 border-r"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between">
              <div className="text-label-1 text-label-normal font-medium">수신함</div>
              <button
                type="button"
                onClick={onClose}
                className="text-material-dimmer hover:bg-fill-alternative hover:text-label-neutral grid h-5 w-5 place-items-center rounded-md bg-transparent"
                aria-label="알림 모달 닫기"
              >
                <IconChevronDoubleLeft className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            className={`bg-line-normal-neutral h-px w-full transition-opacity duration-150 ${
              hasScrolled ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
          <div className="min-h-0 flex-1 overflow-hidden px-2">
            {notifications.length === 0 ? (
              <div className="text-label-alternative flex h-full flex-col items-center justify-start gap-2 pt-40">
                <IconInbox className="text-label-disable h-10 w-10" aria-hidden="true" />
                <p className="text-body-2 font-medium">받은 알림이 없어요</p>
                <p className="text-caption-1 text-label-assistive">
                  새로운 알림이 오면 여기에 표시돼요
                </p>
              </div>
            ) : (
              <div
                className="sidebar-alarm-scroll h-full overflow-y-auto pr-2"
                onScroll={handleScroll}
              >
                <div className="flex flex-col gap-1 pr-1">
                  {notifications.map((item) => {
                    const typeLabel = item.type ? NOTIFICATION_TYPE_LABELS[item.type] : '';
                    const description = [item.projectName, item.content]
                      .filter(Boolean)
                      .join(' · ');
                    return (
                      <SidebarAlarmModalItem
                        key={item.notificationId}
                        title={typeLabel || item.title || ''}
                        description={description}
                        timeText={formatNotificationTime(item.createdAt)}
                        isUnread={item.isRead === false}
                        onClick={() => {
                          // 클릭한 알림을 로컬에서 즉시 읽음 처리 (dot 즉시 사라짐)
                          if (item.notificationId !== undefined && item.isRead === false) {
                            setNotifications((prev) => {
                              const next = prev.map((n) =>
                                n.notificationId === item.notificationId
                                  ? { ...n, isRead: true }
                                  : n,
                              );
                              // 뱃지 카운트 즉시 동기화
                              const unreadInList = next.filter((n) => n.isRead === false).length;
                              onListLoaded?.(unreadInList);
                              return next;
                            });
                            // 백엔드 동기화 (실패해도 UI는 그대로 유지)
                            void privateApi.notification
                              .markAsRead(item.notificationId)
                              .catch(() => undefined);
                          }
                          onNotificationClick?.(item);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <style jsx>{`
        .sidebar-alarm-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--color-label-disable) transparent;
        }

        .sidebar-alarm-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-alarm-scroll::-webkit-scrollbar-thumb {
          border-radius: 9999px;
          background: var(--color-label-disable);
        }

        .sidebar-alarm-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--color-label-assistive);
        }
      `}</style>
    </>
  );
};
