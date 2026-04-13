import { motion } from 'framer-motion';
import type { ComponentType, SVGProps } from 'react';

import { cn } from '@/utils/cn';

interface SidebarMenuButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isCollapsed: boolean;
  label: string;
  labelWidth: number;
  labelTransitionDuration: number;
  badgeText?: string;
  onClick?: () => void;
}

export const SidebarMenuButton = ({
  icon: Icon,
  isCollapsed,
  label,
  labelWidth,
  labelTransitionDuration,
  badgeText,
  onClick,
}: SidebarMenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 w-full items-center justify-start overflow-hidden rounded-md px-2.5 py-2.5 hover:bg-fill-alternative',
        isCollapsed && 'justify-center px-0',
      )}
    >
      <span className={cn('flex items-center gap-1 text-label-alternative', isCollapsed && 'gap-0')}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        <motion.span
          initial={false}
          animate={{ maxWidth: isCollapsed ? 0 : labelWidth, opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: labelTransitionDuration, ease: 'easeInOut' }}
          className="overflow-hidden whitespace-nowrap text-center text-body-2 font-normal text-label-alternative"
        >
          {label}
        </motion.span>
      </span>
      {!isCollapsed && badgeText && (
        <span className="ml-auto rounded-md bg-fill-normal px-1 py-0.5 text-caption-1 font-medium text-label-alternative">
          {badgeText}
        </span>
      )}
    </button>
  );
};
