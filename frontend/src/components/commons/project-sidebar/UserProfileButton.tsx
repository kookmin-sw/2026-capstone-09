import { IconPersonFill } from '@wanteddev/wds-icon';

import { cn } from '@/utils/cn';

interface UserProfileButtonProps {
  isCollapsed: boolean;
  userName?: string;
  userEmail?: string;
  onClick?: () => void;
}

export const UserProfileButton = ({
  isCollapsed,
  userName,
  userEmail,
  onClick,
}: UserProfileButtonProps) => {
  const shouldShowUserInfo = !isCollapsed && Boolean(userName || userEmail);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center border-t border-line-normal-neutral py-[1.09375rem]',
        isCollapsed ? 'justify-center px-0' : 'gap-[0.3125rem] px-[0.15625rem]',
      )}
    >
      <div className="relative flex aspect-square h-[1.5625rem] w-[1.5625rem] shrink-0 items-center justify-center overflow-hidden rounded-full bg-cool-neutral-96 outline outline-1 outline-line-solid-normal outline-offset-[-1px]">
        <IconPersonFill className="h-[0.9375rem] w-[0.9375rem] text-static-white" aria-hidden="true" />
      </div>
      {shouldShowUserInfo && (
        <div className="flex flex-col gap-0">
          {userName && <div className="text-left text-label-1 font-medium text-label-alternative">{userName}</div>}
          {userEmail && (
            <div className="text-left text-caption-1 font-normal text-label-alternative">{userEmail}</div>
          )}
        </div>
      )}
    </button>
  );
};
