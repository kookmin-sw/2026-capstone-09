import { IconPersonFill } from '@wanteddev/wds-icon';

interface UserProfileButtonProps {
  isCollapsed: boolean;
  userName: string;
  userEmail: string;
}

export const UserProfileButton = ({ isCollapsed, userName, userEmail }: UserProfileButtonProps) => {
  return (
    <button
      type="button"
      className={`flex w-full items-center border-t border-[rgba(112,115,124,0.16)] py-7 ${
        isCollapsed ? 'justify-center px-0' : 'gap-2 px-1'
      }`}
    >
      <div className="relative flex aspect-square h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8E9EA] outline outline-1 outline-[#DEE0E1] outline-offset-[-1px]">
        <IconPersonFill className="h-6 w-6 text-white" aria-hidden="true" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col gap-0">
          <div className="text-left text-[1.3rem] font-medium leading-[1.8rem] tracking-[0.025rem] text-[#7E7E7E]">
            {userName}
          </div>
          <div className="text-left text-[1.1rem] font-normal leading-[1.4rem] tracking-[0.034rem] text-[#7E7E7E]">
            {userEmail}
          </div>
        </div>
      )}
    </button>
  );
};
