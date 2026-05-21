'use client';

import { ContentBadge } from '@wanteddev/wds';
import { IconTrash } from '@wanteddev/wds-icon';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { EdgeDeleteConfirmContent, type EdgeNodeInfo } from '@/components/projects/project-detail/edge-delete/EdgeDeleteConfirmContent';
import { cn } from '@/utils/cn';

import type { ReferencedNodeItem } from './useReferenceNodeForm';

interface ReferencedNodesListProps {
  items: readonly ReferencedNodeItem[];
  /** 추가 모드일 때는 외곽 폼 패널과 함께 노출되므로 최대 높이를 좁혀 노출한다. */
  variant?: 'list' | 'add';
  /** 현재 모달을 열고 있는 노드 정보. from/to 방향 계산에 사용한다. */
  currentNode?: EdgeNodeInfo;
  /** 참조 연결 삭제 핸들러. 전달되면 각 아이템에 삭제 버튼이 표시된다. */
  onDeleteEdge?: (edgeId: number) => void;
}

export const ReferencedNodesList = ({
  items,
  variant = 'list',
  currentNode,
  onDeleteEdge,
}: ReferencedNodesListProps) => {
  const { openDialog, closeDialog } = useDialog();

  const handleDeleteClick = (item: ReferencedNodeItem) => {
    const edgeId = item.edgeId!;
    const linkedNode: EdgeNodeInfo | undefined =
      item.number !== undefined
        ? { number: item.number, title: item.title ?? '' }
        : undefined;

    // linkType === 'START': 현재 노드가 시작, 상대 노드가 도착
    // linkType === 'END': 상대 노드가 시작, 현재 노드가 도착
    const fromNode = item.linkType === 'START' ? currentNode : linkedNode;
    const toNode = item.linkType === 'START' ? linkedNode : currentNode;

    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <EdgeDeleteConfirmContent
          fromNode={fromNode}
          toNode={toNode}
          onConfirm={() => {
            closeDialog();
            onDeleteEdge?.(edgeId);
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  return (
    <section className="flex w-full flex-col gap-2">
      <h3 className="text-label-1 text-label-neutral font-semibold">참조 중인 노드 목록</h3>

      {items.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-body-2 text-label-assistive">참조 중인 노드가 없어요.</p>
        </div>
      ) : (
        <ul
          className={cn(
            'custom-scrollbar flex w-full flex-col gap-1 overflow-y-auto pr-2',
            variant === 'list' ? 'max-h-95' : 'max-h-72',
          )}
        >
          {items.map((item) => (
            <li
              key={item.edgeId}
              className="bg-fill-alternative/50 flex items-start gap-2 rounded-lg px-4 py-2"
            >
              <ContentBadge
                size="medium"
                variant="solid"
                color="accent"
                className="!bg-primary-40/10 !text-primary-40 shrink-0"
              >
                #{item.number}
              </ContentBadge>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-body-2 text-label-normal truncate font-medium">
                    {item.title}
                  </span>
                  <span className="text-caption-1 text-label-assistive shrink-0 font-normal">
                    연결한 사람: {item.createdBy?.nickname}
                  </span>
                </div>
                <p className="text-caption-1 text-label-alternative w-full truncate font-normal">
                  {item.comment}
                </p>
              </div>
              {onDeleteEdge && item.edgeId !== undefined && (
                <button
                  type="button"
                  onClick={() => handleDeleteClick(item)}
                  aria-label="참조 연결 삭제"
                  className="text-label-assistive hover:text-status-negative focus-visible:ring-primary-40 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-transparent outline-none transition-colors focus-visible:ring-2"
                >
                  <IconTrash className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

ReferencedNodesList.displayName = 'ReferencedNodesList';
