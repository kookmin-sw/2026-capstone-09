import { motion } from 'framer-motion';

import { IconSearch } from '@/components/common/wds-icon';

interface SearchMenuButtonProps {
  isCollapsed: boolean;
}

export const SearchMenuButton = ({ isCollapsed }: SearchMenuButtonProps) => {
  return (
    <button
      type="button"
      className={`flex h-14 w-full items-center overflow-hidden rounded-[6px] px-4 py-4 hover:bg-[rgba(112,115,124,0.05)] ${
        isCollapsed ? 'justify-start' : 'justify-between'
      }`}
    >
      <span className="flex items-center gap-2 text-[rgba(23,23,25,0.52)]">
        <IconSearch className="h-[18px] w-[18px]" />
        <motion.span
          initial={false}
          animate={{ maxWidth: isCollapsed ? 0 : 48, opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.16, ease: 'easeInOut' }}
          className="overflow-hidden whitespace-nowrap text-center text-[15px] font-normal leading-6 tracking-[0.14px] text-[rgba(23,23,25,0.52)]"
        >
          검색
        </motion.span>
      </span>
    </button>
  );
};
