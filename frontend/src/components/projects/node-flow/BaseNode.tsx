import { ContentBadge, ThemeColorsToken } from '@wanteddev/wds';
import { memo } from 'react';
import type { NodeItem } from '@/api/Api';
import { Users } from '@/components/commons/user/UserAvatarGroup';
import { formatDate, getVisibleTags } from '@/utils/nodeUtils';
import { NodeMenu } from './NodeMenu';
import { getColorToken } from '@/utils/getBadgeColorInfo';
import { ColorType } from '@/constants/badgeColor';

interface BaseNodeProps {
  node: NodeItem;
  variant: 'main' | 'sub';
  isFocused: boolean;
  onNodeClick: (nodeId: number) => void;
  onCreateSubNode?: (nodeId: number) => void;
  onCreateReference?: (nodeId: number) => void;
  onDeleteNode?: (nodeId: number) => void;
}

function BaseNodeComponent({
  node,
  variant,
  isFocused,
  onNodeClick,
  onCreateSubNode,
  onCreateReference,
  onDeleteNode,
}: BaseNodeProps) {
  const { visibleTags, remainingTagsCount } = getVisibleTags(node.tags ?? []);
  const isMain = variant === 'main';
  const nodeNumber = node.number ?? `#${node.nodeId}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.nodeId !== undefined) {
      onNodeClick(node.nodeId);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCreateSubNode = () => {
    if (node.nodeId !== undefined && onCreateSubNode) {
      onCreateSubNode(node.nodeId);
    }
  };

  const handleCreateMeeting = () => {
    // TODO: 회의 생성 모달 열기
  };

  const handleEditMeeting = () => {
    // TODO: 회의 수정 모달 열기
  };

  const handleDeleteMeeting = () => {
    // TODO: 회의 삭제 확인 모달 열기
  };

  const handleCreateReference = () => {
    if (node.nodeId !== undefined && onCreateReference) {
      onCreateReference(node.nodeId);
    }
  };

  const handleDelete = () => {
    if (node.nodeId !== undefined && onDeleteNode) {
      onDeleteNode(node.nodeId);
    }
  };

  const menuVariant = isMain
    ? 'main'
    : node.hasMeeting
      ? 'sub-with-meeting'
      : 'sub-without-meeting';

  return (
    <div
      data-node-id={node.nodeId ?? ''}
      className={`flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] transition-all ${isMain ? 'w-64 gap-5' : 'w-60 gap-3'} ${
        isFocused ? 'outline-primary-40' : 'hover:outline-primary-40 outline-neutral-200'
      }`}
      style={
        isFocused
          ? {
              boxShadow:
                '-2px -2px 4px 0px color-mix(in srgb, var(--color-primary-40) 20%, transparent), 2px 2px 4px 0px color-mix(in srgb, var(--color-primary-40) 20%, transparent)',
            }
          : undefined
      }
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <div className="flex flex-col gap-1 self-stretch">
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <ContentBadge
              size="xsmall"
              variant={isMain ? 'solid' : 'outlined'}
              color={isMain ? undefined : 'neutral'}
              className={isMain ? '!bg-primary-40/10 !text-primary-40' : undefined}
            >
              {nodeNumber}
            </ContentBadge>

            <div className="text-caption-2 text-label-alternative min-w-0 truncate font-normal">
              {formatDate(node.updatedAt ?? '')}
            </div>
          </div>

          <NodeMenu
            variant={menuVariant}
            onCreateSubNode={handleCreateSubNode}
            onCreateMeeting={handleCreateMeeting}
            onEditMeeting={handleEditMeeting}
            onDeleteMeeting={handleDeleteMeeting}
            onCreateReference={handleCreateReference}
            onDelete={handleDelete}
          />
        </div>

        <div className="text-body-1 line-clamp-1 font-medium">{node.title ?? ''}</div>

        {isMain && node.description && (
          <div className="text-label-2 text-label-alternative line-clamp-2 font-normal">
            {node.description}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 self-stretch overflow-hidden">
        <div className="flex min-w-0 items-center gap-1 overflow-hidden">
          {visibleTags.map((tag) => (
            <ContentBadge
              key={tag.tagId}
              color="accent"
              size="xsmall"
              accentColor={getColorToken(tag.color as ColorType) as ThemeColorsToken}
            >
              {tag.name}
            </ContentBadge>
          ))}
          {remainingTagsCount > 0 && (
            <ContentBadge size="xsmall" variant="solid" color="neutral">
              +{remainingTagsCount}
            </ContentBadge>
          )}
        </div>

        {node.assignees && node.assignees.length > 0 && (
          <div className="shrink-0">
            <Users users={node.assignees} maxVisible={2} compact />
          </div>
        )}
      </div>
    </div>
  );
}

export const BaseNode = memo(BaseNodeComponent);
