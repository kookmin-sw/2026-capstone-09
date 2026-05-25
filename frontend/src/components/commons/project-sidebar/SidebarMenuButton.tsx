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
  showDot?: boolean;
  onClick?: () => void;
}

export const SidebarMenuButton = ({
  icon: Icon,
  isCollapsed,
  label,
  labelWidth,
  labelTransitionDuration,
  badgeText,
  showDot,
  onClick,
}: SidebarMenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 w-full appearance-none items-center justify-start overflow-hidden rounded-md border-none bg-transparent px-2 py-2.5 leading-normal hover:bg-fill-alternative',
        isCollapsed && 'justify-center px-0',
      )}
    >
      <span className={cn('flex items-center gap-1.5 text-label-alternative', isCollapsed && 'gap-0')}>
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <motion.span
          initial={false}
          animate={{ maxWidth: isCollapsed ? 0 : labelWidth, opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: labelTransitionDuration, ease: 'easeInOut' }}
          className="overflow-hidden whitespace-nowrap text-center text-body-2 font-normal text-label-alternative"
        >
          {label}
        </motion.span>
      </span>
      {!isCollapsed && (badgeText || showDot) && (
        <div className="relative ml-auto flex shrink-0 items-center">
          {badgeText && (
            <span className="rounded-sm bg-fill-normal px-1 py-0.5 text-caption-1 font-normal text-label-alternative">
              {badgeText}
            </span>
          )}
          {showDot && (
            <span
              className={cn(
                'bg-primary-40 h-2 w-2 rounded-full',
                badgeText ? 'absolute -top-1 -right-1' : 'block',
              )}
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </button>
  );
};
