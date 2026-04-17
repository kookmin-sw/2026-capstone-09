'use client';

import { IconChevronDoubleLeft } from '@wanteddev/wds-icon';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { EXAMPLE_SIDEBAR_ALARM_ITEMS } from '@/constants/exampleConstant';

import { SidebarAlarmModalItem } from './SidebarAlarmModalItem';

interface SidebarAlarmModalProps {
  onClose: () => void;
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

const NOTIFICATION_TYPE_LABELS = {
  MEETING_INVITE: '회의 초대',
  NODE_ASSIGNED: '노드 담당자 배정',
} as const;

const formatNotificationTime = (createdAt: string) => {
  const notificationDate = new Date(createdAt);
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

export const SidebarAlarmModal = ({ onClose }: SidebarAlarmModalProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { notifications } = EXAMPLE_SIDEBAR_ALARM_ITEMS.data;

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
            <div
              className="sidebar-alarm-scroll h-full overflow-y-auto pr-2"
              onScroll={handleScroll}
            >
              <div className="flex flex-col gap-1 pr-1">
                {notifications.map(
                  ({ content, createdAt, isRead, notificationId, projectName, type }) => (
                    <SidebarAlarmModalItem
                      key={notificationId}
                      title={NOTIFICATION_TYPE_LABELS[type] ?? type}
                      description={`@${projectName} · ${content}`}
                      timeText={formatNotificationTime(createdAt)}
                      isUnread={!isRead}
                    />
                  ),
                )}
              </div>
            </div>
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
