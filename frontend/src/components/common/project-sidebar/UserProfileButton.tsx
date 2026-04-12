import { IconPersonFill } from '@wanteddev/wds-icon';

interface UserProfileButtonProps {
  isCollapsed: boolean;
  userName?: string;
  userEmail?: string;
}

export const UserProfileButton = ({ isCollapsed, userName, userEmail }: UserProfileButtonProps) => {
  const shouldShowUserInfo = !isCollapsed && Boolean(userName || userEmail);

  return (
    <button
      type="button"
      className={`flex w-full items-center border-t border-[#70737c29] py-7 ${
        isCollapsed ? 'justify-center px-0' : 'gap-2 px-1'
      }`}
    >
      <div className="relative flex aspect-square h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8E9EA] outline outline-1 outline-[#DEE0E1] outline-offset-[-1px]">
        <IconPersonFill className="h-6 w-6 text-white" aria-hidden="true" />
      </div>
      {shouldShowUserInfo && (
        <div className="flex flex-col gap-0">
          {userName && (
            <div className="text-left text-heading-1 font-medium text-[#7E7E7E]">
              {userName}
            </div>
          )}
          {userEmail && (
            <div className="text-left text-headline-1 font-normal text-[#7E7E7E]">
              {userEmail}
            </div>
          )}
        </div>
      )}
    </button>
  );
};
