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
        'flex w-full items-center border-t border-line-normal-neutral py-4',
        isCollapsed ? 'justify-center px-0' : 'gap-2 px-0.5',
      )}
    >
      <div className="relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-solid-normal bg-cool-neutral-96">
        <IconPersonFill className="h-4 w-4 text-static-white" aria-hidden="true" />
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
