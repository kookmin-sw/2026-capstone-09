import { ContentBadge, ThemeColorsToken } from '@wanteddev/wds';
import { Users } from '@/components/commons/user/UserAvatarGroup';
import { NodeMenu } from '@/components/projects/node-flow/NodeMenu';
import { ColorType } from '@/constants/badgeColor';
import { NodeStatusType } from '@/constants/nodeStatus';
import { useNodeMenuActions } from '@/hooks/useNodeMenuActions';
import { getColorToken } from '@/utils/getBadgeColorInfo';
import { getNodeStatusColor, getNodeStatusIcon, getNodeStatusLabel } from '@/utils/getNodeStatus';
import { getVisibleTags } from '@/utils/nodeUtils';

interface ListCardTag {
  tagId: number;
  name: string;
  color: string;
}

interface ListCardAssignee {
  userId: number;
  profileImage?: string;
  name: string;
}

interface ListCardProps {
  nodeId: number;
  projectId: number;
  nodeNumber: string;
  status: NodeStatusType;
  date: string;
  title: string;
  tags?: ListCardTag[];
  assignees?: ListCardAssignee[];
  isMainNode?: boolean;
  hasMeeting?: boolean;
  onDoubleClick?: () => void;
}

export function ListCard({
  nodeId,
  projectId,
  nodeNumber,
  status,
  date,
  title,
  tags = [],
  assignees = [],
  isMainNode = false,
  hasMeeting = false,
  onDoubleClick,
}: ListCardProps) {
  const { visibleTags, remainingTagsCount } = getVisibleTags(tags, 8);

  const menuVariant = isMainNode
    ? 'main'
    : hasMeeting
      ? 'sub-with-meeting'
      : 'sub-without-meeting';

  const menuActions = useNodeMenuActions({ nodeId, projectId, nodeTitle: title, nodeNumber });

  return (
    <div
      className="p-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-200 cursor-pointer hover:shadow-sm transition-shadow"
      onDoubleClick={onDoubleClick}
    >
      <div className="pb-1 flex items-center gap-2">
        <div className="flex-1 flex justify-between items-center">
          <div className="flex items-center gap-2 overflow-hidden">
            <ContentBadge
              size="xsmall"
              variant="solid"
              color="accent"
              accentColor={getNodeStatusColor(status) as ThemeColorsToken}
              leadingContent={getNodeStatusIcon(status)}
            >
              {getNodeStatusLabel(status)}
            </ContentBadge>

            {isMainNode ? (
              <ContentBadge
                className="!bg-primary-40/10 !text-primary-40"
                size="xsmall"
                variant="solid"
              >
                #{nodeNumber}
              </ContentBadge>
            ) : (
              <ContentBadge color="neutral" size="xsmall" variant="outlined">
                #{nodeNumber}
              </ContentBadge>
            )}

            <div className="text-caption-2 text-label-alternative font-normal">{date}</div>
          </div>

          <div className="relative z-10">
            <NodeMenu variant={menuVariant} position="bottom-end" {...menuActions} />
          </div>
        </div>
      </div>

      <div className="pb-3">
        <div className="text-body-1 font-medium text-label-normal line-clamp-2">
          {title}
        </div>
      </div>

      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1 flex-wrap min-w-0">
          {visibleTags.map((tag) => (
            <ContentBadge
              key={tag.tagId}
              color="accent"
              size="small"
              accentColor={getColorToken(tag.color as ColorType) as ThemeColorsToken}
            >
              {tag.name}
            </ContentBadge>
          ))}
          {remainingTagsCount > 0 && (
            <ContentBadge color="neutral" size="small" variant="solid">
              +{remainingTagsCount}
            </ContentBadge>
          )}
        </div>

        {assignees.length > 0 && (
          <div className="shrink-0">
            <Users
              users={assignees.map((assignee) => ({
                userId: assignee.userId,
                nickname: assignee.name,
                profileImageUrl: assignee.profileImage,
              }))}
              maxVisible={3}
              compact={false}
              size="xsmall"
            />
          </div>
        )}
      </div>
    </div>
  );
}