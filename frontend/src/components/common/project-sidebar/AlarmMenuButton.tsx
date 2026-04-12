import { motion } from 'framer-motion';

import { IconBell } from '@/components/common/wds-icon';

interface AlarmMenuButtonProps {
  isCollapsed: boolean;
}

export const AlarmMenuButton = ({ isCollapsed }: AlarmMenuButtonProps) => {
  return (
    <button
      type="button"
      className={`flex h-14 w-full items-center overflow-hidden rounded-[6px] px-4 py-4 hover:bg-[rgba(112,115,124,0.05)] ${
        isCollapsed ? 'justify-start' : 'justify-between'
      }`}
    >
      <span className="flex items-center gap-2 text-[rgba(23,23,25,0.52)]">
        <IconBell className="h-[18px] w-[18px]" />
        <motion.span
          initial={false}
          animate={{ maxWidth: isCollapsed ? 0 : 64, opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.16, ease: 'easeInOut' }}
          className="overflow-hidden whitespace-nowrap text-center text-[15px] font-normal leading-6 tracking-[0.14px] text-[rgba(23,23,25,0.52)]"
        >
          수신함
        </motion.span>
      </span>
      {!isCollapsed && (
        <span className="rounded-[6px] bg-[rgba(112,115,124,0.08)] px-[6px] py-[3px] text-[11px] font-medium leading-[14px] tracking-[0.34px] text-[rgba(55,56,60,0.61)]">
          +99
        </span>
      )}
    </button>
  );
};
