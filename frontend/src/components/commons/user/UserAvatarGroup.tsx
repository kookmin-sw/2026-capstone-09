import {
  Avatar,
  AvatarGroup,
  type Theme,
  Tooltip,
  TooltipContent,
  TooltipGroup,
  TooltipTrigger,
  Typography,
} from '@wanteddev/wds';

import { normalizeImageUrl } from '@/utils/normalizeImageUrl';

const IMAGE_AVATAR_SX = (_theme: Theme) => ({
  padding: '0',
});

export interface UserInfo {
  userId?: number;
  email?: string;
  nickname?: string;
  profileImageUrl?: string | null;
  color?: string;
}

interface UsersProps {
  users: readonly UserInfo[];
  maxVisible?: number;
  compact?: boolean; // true면 "+n", false면 "외 n명"
  size?: 'xsmall' | 'small';
}

interface UserAvatarWithTooltipProps {
  user: UserInfo;
  position: 'bottom-center' | 'bottom-end';
  size: 'xsmall' | 'small';
}

const UserAvatarWithTooltip = ({ user, position, size }: UserAvatarWithTooltipProps) => {
  const profileImageUrl = normalizeImageUrl(user.profileImageUrl ?? undefined);
  const borderStyle =
    !profileImageUrl && user.color
      ? { outline: `2.5px solid ${user.color}`, borderRadius: '50%' }
      : undefined;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div style={borderStyle}>
          <Avatar
            variant="person"
            size={size}
            src={profileImageUrl}
            sx={profileImageUrl ? IMAGE_AVATAR_SX : undefined}
          />
        </div>
      </TooltipTrigger>

      <TooltipContent size="small" position={position}>
        <div className="flex min-w-35 items-center gap-2 px-1 py-1.5">
          <Avatar
            variant="person"
            size="xsmall"
            src={profileImageUrl}
            sx={profileImageUrl ? IMAGE_AVATAR_SX : undefined}
          />
          <div className="flex flex-col">
            <span className="text-caption-1 font-medium text-neutral-100">
              {user.nickname ?? ''}
            </span>
            <span className="text-caption-2 font-normal text-neutral-100">{user.email ?? ''}</span>
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
        <div className="flex min-w-40 flex-col gap-2 px-1 py-1.5">
          {users.map((user, idx) => {
            const profileImageUrl = normalizeImageUrl(user.profileImageUrl ?? undefined);

            return (
              <div key={user.email ?? idx} className="flex items-center gap-2">
                <Avatar
                  variant="person"
                  size="xsmall"
                  src={profileImageUrl}
                  sx={profileImageUrl ? IMAGE_AVATAR_SX : undefined}
                />
                <div className="flex flex-col">
                  <span className="text-caption-1 font-medium text-neutral-100">
                    {user.nickname ?? ''}
                  </span>
                  <span className="text-caption-2 font-normal text-neutral-100">
                    {user.email ?? ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const Users = ({ users, maxVisible = 5, compact = false, size = 'small' }: UsersProps) => {
  const visibleUsers = users.slice(0, maxVisible);

  return (
    <TooltipGroup>
      <AvatarGroup
        size={size}
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
              size={size}
              position={index === visibleUsers.length - 1 ? 'bottom-end' : 'bottom-center'}
            />
          </div>
        ))}
      </AvatarGroup>
    </TooltipGroup>
  );
};
