import {
  ContentBadge,
} from '@wanteddev/wds';
import { memo } from 'react';
import { Users } from '@/components/commons/user/UserAvatarGroup';
import type { Node } from '@/types/FlowChartTypes';
import { formatDate, getVisibleTags } from '@/utils/nodeUtils';
import { NodeMenu } from './NodeMenu';

interface BaseNodeProps {
  node: Node;
  variant: 'main' | 'sub';
  isFocused: boolean;
  onNodeClick: (nodeId: number, e?: React.MouseEvent) => void;
  onCreateSubNode?: (parentNodeId: number) => void;
  onCreateReference?: (startNodeId: number) => void;
  onDeleteNode?: (nodeId: number) => void;
  allNodes?: Node[];
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
  const { visibleTags, remainingTagsCount } = getVisibleTags(node.tags);
  const isMain = variant === 'main';
  const nodeNumber = `#${node.number}`;

  const handleClick = (e: React.MouseEvent) => {
    onNodeClick(node.nodeId, e);
  };

  const handleCreateSubNode = () => {
    onCreateSubNode?.(node.nodeId);
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
    onCreateReference?.(node.nodeId);
  };

  const handleDelete = () => {
    onDeleteNode?.(node.nodeId);
  };

  const menuVariant = isMain
    ? 'main'
    : node.hasMeeting
    ? 'sub-with-meeting'
    : 'sub-without-meeting';

  const menuKey = `menu-${node.nodeId}-${node.childNodeIds.length}`;

  return (
    <div
      data-node-id={node.nodeId}
      className={`bg-white flex flex-col overflow-hidden rounded-xl p-4 outline outline-1 outline-offset-[-1px] cursor-pointer transition-all
        ${isMain ? 'w-64 gap-5' : 'w-60 gap-3'}
        ${isFocused
          ? 'outline-primary-40'
          : 'outline-neutral-200 hover:outline-primary-40'
        }`}
      style={isFocused ? {
        boxShadow: '-2px -2px 4px 0px color-mix(in srgb, var(--color-primary-40) 20%, transparent), 2px 2px 4px 0px color-mix(in srgb, var(--color-primary-40) 20%, transparent)'
      } : undefined}
      onClick={handleClick}
    >
      <div className="flex self-stretch flex-col gap-1">
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

            <div className="min-w-0 truncate text-caption-2 font-normal text-label-alternative">
              {formatDate(node.updatedAt)}
            </div>
          </div>

          <NodeMenu
            key={menuKey}
            variant={menuVariant}
            onCreateSubNode={handleCreateSubNode}
            onCreateMeeting={handleCreateMeeting}
            onEditMeeting={handleEditMeeting}
            onDeleteMeeting={handleDeleteMeeting}
            onCreateReference={handleCreateReference}
            onDelete={handleDelete}
            onMenuClick={handleClick}
          />
        </div>

        <div className="text-body-1 font-medium line-clamp-1">
          {node.title}
        </div>

        {isMain && node.description && (
          <div className="text-label-2 font-normal text-label-alternative line-clamp-2">
            {node.description}
          </div>
        )}
      </div>

      <div className="flex self-stretch items-center justify-between gap-2 overflow-hidden">
        <div className="flex min-w-0 items-center gap-1 overflow-hidden">
          {visibleTags.map((tag) => (
            <ContentBadge
              key={tag.tagId}
              size="xsmall"
              variant="solid"
              color="neutral"
              sx={{
                backgroundColor: `${tag.color}1A`,
                color: tag.color,
              }}
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

        {node.assignees.length > 0 && (
          <div className="shrink-0">
            <Users users={node.assignees} maxVisible={2} compact />
          </div>
        )}
      </div>
    </div>
  );
}

export const BaseNode = memo(BaseNodeComponent);