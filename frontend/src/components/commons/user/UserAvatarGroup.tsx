import {
  Avatar,
  AvatarGroup,
  Tooltip,
  TooltipContent,
  TooltipGroup,
  TooltipTrigger,
  Typography,
} from '@wanteddev/wds';

export interface UserInfo {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
}

interface UsersProps {
  users: readonly UserInfo[];
  maxVisible?: number;
  compact?: boolean; // true면 "+n", false면 "외 n명"
}

interface UserAvatarWithTooltipProps {
  user: UserInfo;
  position: 'bottom-center' | 'bottom-end';
}

const UserAvatarWithTooltip = ({ user, position }: UserAvatarWithTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div>
          <Avatar variant="person" size="xsmall" src={user.profileImageUrl ?? undefined} />
        </div>
      </TooltipTrigger>

      <TooltipContent size="small" position={position}>
        <div className="flex min-w-[140px] items-center gap-2 px-1 py-1.5">
          <Avatar variant="person" size="xsmall" src={user.profileImageUrl ?? undefined} />
          <div className="flex flex-col">
            <span className="text-caption-1 text-neutral-100 font-medium">{user.nickname}</span>
            <span className="text-caption-2 text-neutral-100 font-normal">{user.email}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface AllUsersTooltipProps {
  users: readonly UserInfo[];
  maxVisible?: number;
  compact?: boolean;
}

const AllUsersTooltip = ({ users, maxVisible = 5, compact = false }: AllUsersTooltipProps) => {
  const hiddenUserCount = users.length - maxVisible;

  if (hiddenUserCount <= 0) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div>
          <Typography
            className={compact ? '-ml-1' : ''}
            variant={compact ? 'caption2' : 'label1'}
            weight={compact ? 'medium' : 'bold'}
            color="semantic.label.alternative"
          >
            {compact ? `+${hiddenUserCount}` : `외 ${hiddenUserCount}명`}
          </Typography>
        </div>
      </TooltipTrigger>

      <TooltipContent size="small" position="bottom-end">
        <div className="flex min-w-[160px] flex-col gap-2 px-1 py-1.5">
          {users.map((user, index) => (
            <div key={`${user.userId}-${index}`} className="flex items-center gap-2">
              <Avatar variant="person" size="xsmall" src={user.profileImageUrl ?? undefined} />
              <div className="flex flex-col">
                <span className="text-caption-1 text-neutral-100 font-medium">{user.nickname}</span>
                <span className="text-caption-2 text-neutral-100 font-normal">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const Users = ({ users, maxVisible = 5, compact = false }: UsersProps) => {
  const visibleUsers = users.slice(0, maxVisible);

  return (
    <TooltipGroup>
      <AvatarGroup
        size="small"
        trailingContent={
          users.length > maxVisible ? (
            <AllUsersTooltip users={users} maxVisible={maxVisible} compact={compact} />
          ) : undefined
        }
      >
        {visibleUsers.map((user, index) => (
          <div key={`${user.userId}-${index}`} className={index === 0 ? '' : '-ml-1'}>
            <UserAvatarWithTooltip
              user={user}
              position={index === visibleUsers.length - 1 ? 'bottom-end' : 'bottom-center'}
            />
          </div>
        ))}
      </AvatarGroup>
    </TooltipGroup>
  );
};
