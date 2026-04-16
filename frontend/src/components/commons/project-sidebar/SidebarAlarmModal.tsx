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

export const SidebarAlarmModal = ({ onClose }: SidebarAlarmModalProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setHasScrolled(event.currentTarget.scrollTop > 0);
  };

  return (
    <>
      <motion.div
        className="absolute left-full top-0 z-0 h-screen w-80 border-r border-line-normal-neutral bg-static-white"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between">
              <div className="text-label-1 font-medium text-label-normal">수신함</div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-5 w-5 place-items-center rounded-md bg-transparent text-material-dimmer hover:bg-fill-alternative hover:text-label-neutral"
                aria-label="알림 모달 닫기"
              >
                <IconChevronDoubleLeft className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            className={`h-px w-full bg-line-normal-neutral transition-opacity duration-150 ${
              hasScrolled ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
          <div className="min-h-0 flex-1 overflow-hidden px-2">
            <div className="sidebar-alarm-scroll h-full overflow-y-auto pr-2" onScroll={handleScroll}>
              <div className="flex flex-col gap-1 pr-1">
                {EXAMPLE_SIDEBAR_ALARM_ITEMS.map(({ id, title, description, timeText, isUnread }) => (
                  <SidebarAlarmModalItem
                    key={id}
                    title={title}
                    description={description}
                    timeText={timeText}
                    isUnread={isUnread}
                  />
                ))}
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
