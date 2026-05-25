import { ContentBadge, ThemeColorsToken } from '@wanteddev/wds';
import { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import type { NodeItem } from '@/api/Api';
import { Users } from '@/components/commons/user/UserAvatarGroup';
import { ColorType } from '@/constants/badgeColor';
import { useActiveNodeUsers } from '@/contexts/YjsContext';
import { useNodeMenuActions } from '@/hooks/useNodeMenuActions';
import { getColorToken } from '@/utils/getBadgeColorInfo';
import { formatDate, getVisibleTags } from '@/utils/nodeUtils';
import { NodeMenu } from './NodeMenu';

interface CustomNodeData extends NodeItem {
  isMainNode: boolean;
  projectId: number;
  onCreateSubNode?: (nodeId: number) => void;
  onSelectNode?: (nodeId: number) => void;
}

function CustomFlowNodeComponent({ data, selected }: NodeProps<CustomNodeData>) {
  const { visibleTags, remainingTagsCount } = getVisibleTags(data.tags ?? []);
  const activeUsers = useActiveNodeUsers(data.nodeId);
  const isMain = data.isMainNode;
  const nodeNumber = data.number ?? data.nodeId;

  const menuActions = useNodeMenuActions({
    nodeId: data.nodeId ?? 0,
    projectId: data.projectId,
    nodeTitle: data.title ?? undefined,
    nodeNumber,
    onBeforeAction: () => {
      if (data.nodeId !== undefined) data.onSelectNode?.(data.nodeId);
    },
  });

  const handleCreateSubNode = () => {
    if (data.nodeId !== undefined) {
      data.onSelectNode?.(data.nodeId);
      data.onCreateSubNode?.(data.nodeId);
    }
  };

  const menuVariant = isMain
    ? 'main'
    : data.hasMeeting
      ? 'sub-with-meeting'
      : 'sub-without-meeting';

  return (
    <div
      data-node-id={data.nodeId ?? ''}
      className={`flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] transition-all ${isMain ? 'w-64 gap-5' : 'w-60 gap-3'} ${
        selected ? 'outline-primary-40' : 'hover:outline-primary-40 outline-neutral-200'
      }`}
      style={
        selected
          ? {
              boxShadow:
                '-2px -2px 4px 0px color-mix(in srgb, var(--color-primary-40) 20%, transparent), 2px 2px 4px 0px color-mix(in srgb, var(--color-primary-40) 20%, transparent)',
            }
          : undefined
      }
    >
      {/* 연결을 위한 Handles */}
      {isMain ? (
        <>
          {/* 메인 노드끼리 수평 직선 */}
          <Handle
            id="main-target"
            type="target"
            position={Position.Left}
            style={{ opacity: 0, pointerEvents: 'none', left: '0px', top: '60px' }}
          />
          <Handle
            id="main-source"
            type="source"
            position={Position.Right}
            style={{ opacity: 0, pointerEvents: 'none', right: '0px', top: '60px' }}
          />
          {/* 참조 관계용 - 왼쪽 */}
          <Handle
            id="ref-source"
            type="source"
            position={Position.Left}
            style={{ opacity: 0, pointerEvents: 'none', left: '0px', top: '60px' }}
          />
          {/* 참조 관계용 - 오른쪽 */}
          <Handle
            id="ref-target"
            type="target"
            position={Position.Right}
            style={{ opacity: 0, pointerEvents: 'none', right: '0px', top: '60px' }}
          />
          {/* 아래 방향으로 서브 노드 (왼쪽에서 20px) */}
          <Handle
            id="child-source"
            type="source"
            position={Position.Bottom}
            style={{ opacity: 0, pointerEvents: 'none', bottom: '0px', left: '20px' }}
          />
        </>
      ) : (
        <>
          {/* 서브 노드 수직 연결(child-source의 선을 받음) */}
          <Handle
            id="parent-target"
            type="target"
            position={Position.Top}
            style={{ opacity: 0, pointerEvents: 'none', top: '0px', left: '50%' }}
          />
          {/* 서브 노드 좌우 연결 */}
          <Handle
            id="target"
            type="target"
            position={Position.Left}
            style={{ opacity: 0, pointerEvents: 'none', left: '0px', top: '48px' }}
          />
          <Handle
            id="source"
            type="source"
            position={Position.Right}
            style={{ opacity: 0, pointerEvents: 'none', right: '0px', top: '48px' }}
          />
          {/* 참조 관계용 - 왼쪽 */}
          <Handle
            id="ref-source"
            type="source"
            position={Position.Left}
            style={{ opacity: 0, pointerEvents: 'none', left: '0px', top: '48px' }}
          />
          {/* 참조 관계용 - 오른쪽 */}
          <Handle
            id="ref-target"
            type="target"
            position={Position.Right}
            style={{ opacity: 0, pointerEvents: 'none', right: '0px', top: '48px' }}
          />
          {/* 서브 노드의 서브 노드 (오른쪽으로) */}
          <Handle
            id="child-source"
            type="source"
            position={Position.Right}
            style={{ opacity: 0, pointerEvents: 'none', right: '0px', top: '48px' }}
          />
        </>
      )}

      <div className="flex flex-col gap-1 self-stretch">
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <ContentBadge
              size="xsmall"
              variant={isMain ? 'solid' : 'outlined'}
              color={isMain ? undefined : 'neutral'}
              className={isMain ? '!bg-primary-40/10 !text-primary-40' : undefined}
            >
              #{nodeNumber}
            </ContentBadge>

            <div className="text-caption-2 text-label-alternative min-w-0 truncate font-normal">
              {formatDate(data.updatedAt ?? '')}
            </div>
          </div>

          <NodeMenu
            variant={menuVariant}
            {...menuActions}
            onCreateSubNode={handleCreateSubNode}
          />
        </div>

        <div className="text-body-1 line-clamp-1 font-medium">{data.title ?? ''}</div>

        {isMain && data.description && (
          <div className="text-label-2 text-label-alternative line-clamp-2 font-normal">
            {data.description}
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

        {activeUsers.length > 0 && (
          <div className="shrink-0 -my-1.5 origin-right scale-75">
            <Users users={activeUsers} maxVisible={2} compact size="xsmall" />
          </div>
        )}
      </div>
    </div>
  );
}

export const CustomNode = memo(CustomFlowNodeComponent);
