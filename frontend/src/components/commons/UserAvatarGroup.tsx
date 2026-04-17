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
  email: string;
  name: string;
}

interface UsersProps {
  users: readonly UserInfo[];
}

const MAX_VISIBLE_ONLINE_USERS = 5;

interface UserAvatarWithTooltipProps {
  user: UserInfo;
  position: 'bottom-center' | 'bottom-end';
}

const tooltipTextColor = 'text-[var(--color-neutral-100)]';

const UserAvatarWithTooltip = ({ user, position }: UserAvatarWithTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div>
          <Avatar variant="person" size="xsmall" />
        </div>
      </TooltipTrigger>

      <TooltipContent size="small" position={position}>
        <div className="flex min-w-[140px] items-center gap-2 px-1 py-1.5">
          <Avatar variant="person" size="xsmall" />
          <div className="flex flex-col">
            <span className={`text-caption-1 font-medium ${tooltipTextColor}`}>{user.name}</span>
            <span className={`text-caption-2 font-normal ${tooltipTextColor}`}>{user.email}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface AllUsersTooltipProps {
  users: readonly UserInfo[];
}

const AllUsersTooltip = ({ users }: AllUsersTooltipProps) => {
  const hiddenUserCount = users.length - MAX_VISIBLE_ONLINE_USERS;

  if (hiddenUserCount <= 0) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div>
          <Typography variant="label1" weight="bold" color="semantic.label.alternative">
            외 {hiddenUserCount}명
          </Typography>
        </div>
      </TooltipTrigger>

      <TooltipContent size="small" position="bottom-end">
        <div className="flex min-w-[160px] flex-col gap-2 px-1 py-1.5">
          {users.map((user) => (
            <div key={user.email} className="flex items-center gap-2">
              <Avatar variant="person" size="xsmall" />
              <div className="flex flex-col">
                <span className={`text-caption-1 font-medium ${tooltipTextColor}`}>
                  {user.name}
                </span>
                <span className={`text-caption-2 font-normal ${tooltipTextColor}`}>
                  {user.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const Users = ({ users }: UsersProps) => {
  const visibleUsers = users.slice(0, MAX_VISIBLE_ONLINE_USERS);

  return (
    <TooltipGroup>
      <AvatarGroup
        size="small"
        trailingContent={
          users.length > MAX_VISIBLE_ONLINE_USERS ? <AllUsersTooltip users={users} /> : undefined
        }
      >
        {visibleUsers.map((user, index) => (
          <div key={user.email} className={index === 0 ? '' : '-ml-1'}>
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
