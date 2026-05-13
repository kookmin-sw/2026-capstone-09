import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ContentBadge, ThemeColorsToken, Typography } from '@wanteddev/wds';
import clsx from 'clsx';

import { KanbanItem } from '@/api/Api';
import { getNodeStatusColor, getNodeStatusIcon, getNodeStatusLabel } from '@/utils/getNodeStatus';
import { formatDate } from '@/utils/nodeUtils';

import { NodeCard } from './NodeCard';

interface KanbanColumnProps {
  status: 'WAITING' | 'IN_PROGRESS' | 'DONE';
  nodes: KanbanItem[];
  onNodeDoubleClick?: (nodeId: number) => void;
}

export function KanbanColumn({ status, nodes, onNodeDoubleClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const validNodes = nodes.filter((node): node is KanbanItem & { nodeId: number } => node.nodeId != null);
  const nodeIds = validNodes.map((node) => node.nodeId);

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      <div
        className={clsx(
          'flex-1 min-h-0 bg-line-normal-alternative rounded-xl flex flex-col',
          status === 'WAITING' && 'border-t-4 border-t-neutral-400',
          status === 'IN_PROGRESS' && 'border-t-4 border-t-orange-500',
          status === 'DONE' && 'border-t-4 border-t-green-500'
        )}
      >
        <div className="pt-6 pr-6 pl-3">
          <ContentBadge
            size="medium"
            variant="solid"
            color="accent"
            accentColor={getNodeStatusColor(status) as ThemeColorsToken}
            leadingContent={getNodeStatusIcon(status)}
          >
            {getNodeStatusLabel(status)}
          </ContentBadge>
        </div>

        <SortableContext id={status} items={nodeIds} strategy={verticalListSortingStrategy}>
          <div
            ref={setNodeRef}
            className="flex-1 min-h-0 overflow-y-auto pr-6 pb-3 pl-3 flex flex-col gap-2.5 mt-2.5"
          >
            {validNodes.map((node) => (
              <NodeCard
                key={node.nodeId}
                nodeId={node.nodeId}
                nodeNumber={node.number || ''}
                date={node.updatedAt ? formatDate(node.updatedAt) : ''}
                title={node.title || '제목 없음'}
                tags={node.tags?.map((tag) => ({
                  tagId: tag.tagId ?? 0,
                  name: tag.name ?? '',
                  color: tag.color ?? 'neutral',
                }))}
                isMainNode={!(node.number || '').includes('.')}
                onDoubleClick={() => onNodeDoubleClick?.(node.nodeId)}
              />
            ))}
            {validNodes.length === 0 && (
              <div className="flex items-center justify-center h-32 text-label-alternative/40">
                <Typography variant="label1">카드가 없습니다</Typography>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}