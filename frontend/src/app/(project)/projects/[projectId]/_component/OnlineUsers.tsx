import { IconPersonFill } from '@wanteddev/wds-icon';
import { useRef, useState } from 'react';

import { cn } from '@/utils/cn';

export interface OnlineUserTypes {
  email: string;
  name: string;
}

interface OnlineUsersProps {
  users: OnlineUserTypes[];
}

const MAX_VISIBLE_USERS = 5;

interface OnlineUserAvatarProps {
  className?: string;
  iconClassName?: string;
}

const OnlineUserAvatar = ({ className, iconClassName }: OnlineUserAvatarProps) => {
  return (
    <div
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-full border border-neutral-99 bg-cool-neutral-96',
        className,
      )}
    >
      <IconPersonFill
        className={cn('h-4 w-4 text-static-white', iconClassName)}
        aria-hidden="true"
      />
    </div>
  );
};

interface OnlineUserAvatarWithTooltipProps {
  user: OnlineUserTypes;
}

const OnlineUserAvatarWithTooltip = ({ user }: OnlineUserAvatarWithTooltipProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipAlign, setTooltipAlign] = useState<'center' | 'end'>('center');

  const handleMouseEnter = () => {
    const triggerElement = triggerRef.current;
    const tooltipElement = tooltipRef.current;

    if (!triggerElement || !tooltipElement) {
      return;
    }

    const triggerRect = triggerElement.getBoundingClientRect();
    const tooltipWidth = tooltipElement.offsetWidth;
    const viewportWidth = window.innerWidth;
    const centeredRightEdge = triggerRect.left + triggerRect.width / 2 + tooltipWidth / 2;

    setTooltipAlign(centeredRightEdge > viewportWidth - 8 ? 'end' : 'center');
  };

  return (
    <div className="group relative" onMouseEnter={handleMouseEnter}>
      <div ref={triggerRef}>
        <OnlineUserAvatar />
      </div>
      <div
        ref={tooltipRef}
        className={
          tooltipAlign === 'end'
            ? 'pointer-events-none absolute top-full right-0 z-10 mt-2 min-w-max rounded-md border border-line-normal-neutral bg-static-white px-3.5 py-2.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
            : 'pointer-events-none absolute top-full left-1/2 z-10 mt-2 min-w-max -translate-x-1/2 rounded-md border border-line-normal-neutral bg-static-white px-3.5 py-2.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
        }
      >
        <div className="flex items-center gap-2">
          <OnlineUserAvatar className="h-8 w-8" iconClassName="h-5 w-5" />
          <div className="flex flex-col">
            <p className="text-caption-1 font-medium text-label-normal">{user.name}</p>
            <p className="text-caption-2 font-normal text-label-alternative">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OnlineUsers = ({ users }: OnlineUsersProps) => {
  const visibleUsers = users.slice(0, MAX_VISIBLE_USERS);
  const hiddenUsers = users.slice(MAX_VISIBLE_USERS);
  const hiddenUserCount = Math.max(users.length - MAX_VISIBLE_USERS, 0);

  return (
    <div className="flex items-center">
      {visibleUsers.map((user) => (
        <div
          key={user.email}
          className="-ml-2.5 first:ml-0"
          aria-label={`${user.name} 접속 중`}
        >
          <OnlineUserAvatarWithTooltip user={user} />
        </div>
      ))}
      {hiddenUserCount > 0 && (
        <div className="group relative ml-2">
          <span
            className="cursor-default text-body-2 font-medium text-label-alternative"
            aria-label={`추가 접속 유저 ${hiddenUsers.map(({ name }) => name).join(', ')}`}
          >
            외 {hiddenUserCount}명
          </span>
          <div className="pointer-events-none absolute top-full right-0 z-10 mt-2 min-w-max rounded-md border border-line-normal-neutral bg-static-white px-3.5 py-3.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <div className="flex min-w-44 flex-col gap-2.5">
              {users.map((user) => (
                <div key={user.email} className="flex items-center gap-2">
                  <OnlineUserAvatar className="h-8 w-8" iconClassName="h-5 w-5" />
                  <div className="flex flex-col">
                    <p className="text-caption-1 font-medium text-label-normal">{user.name}</p>
                    <p className="text-caption-2 font-normal text-label-alternative">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
