import { motion } from 'framer-motion';
import type { ComponentType, SVGProps } from 'react';

interface SidebarMenuButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isCollapsed: boolean;
  label: string;
  labelWidth: number;
  badgeText?: string;
}

export const SidebarMenuButton = ({
  icon: Icon,
  isCollapsed,
  label,
  labelWidth,
  badgeText,
}: SidebarMenuButtonProps) => {
  return (
    <button
      type="button"
      className={`flex h-14 w-full items-center overflow-hidden rounded-[6px] px-4 py-4 hover:bg-[#70737c0d] ${
        isCollapsed ? 'justify-start' : 'justify-between'
      }`}
    >
      <span className="flex items-center gap-2 text-[#17171985]">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        <motion.span
          initial={false}
          animate={{ maxWidth: isCollapsed ? 0 : labelWidth, opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.16, ease: 'easeInOut' }}
          className="overflow-hidden whitespace-nowrap text-center text-title-3 font-normal text-[#17171985]"
        >
          {label}
        </motion.span>
      </span>
      {!isCollapsed && badgeText && (
        <span className="rounded-[6px] bg-[#70737c14] px-[6px] py-[3px] text-headline-1 font-medium text-[#37383c9c]">
          {badgeText}
        </span>
      )}
    </button>
  );
};
