'use client';

import { TextButton } from '@wanteddev/wds';
import { IconClose, IconPlus } from '@wanteddev/wds-icon';

import { NodeNumberBadge, ReferencedNodesList } from './ReferencedNodesList';
import { ReferenceNodeAddForm } from './ReferenceNodeAddForm';
import {
  type ReferencedNodeItem,
  type ReferenceNodeCreatePayload,
  type ReferenceNodeOption,
  useReferenceNodeForm,
} from './useReferenceNodeForm';
import type { EdgeNodeInfo } from '@/components/projects/project-detail/edge-delete/EdgeDeleteConfirmContent';

interface ReferenceNodeModalContentProps {
  startNodeId: number;
  referencedNodes: readonly ReferencedNodeItem[];
  nodeOptions: readonly ReferenceNodeOption[];
  currentNode?: EdgeNodeInfo;
  onClose: () => void;
  onCreate?: (payload: ReferenceNodeCreatePayload) => void;
  onDeleteEdge?: (edgeId: number) => void;
}

export const ReferenceNodeModalContent = ({
  startNodeId,
  referencedNodes,
  nodeOptions,
  currentNode,
  onClose,
  onCreate,
  onDeleteEdge,
}: ReferenceNodeModalContentProps) => {
  const form = useReferenceNodeForm({ startNodeId, nodeOptions });
  const { handleSubmit, canCreate, buildPayload, viewMode, openAddView, closeAddView } = form;

  const handleCreate = handleSubmit(() => {
    if (!canCreate) return;
    onCreate?.(buildPayload());
    onClose();
  });

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={handleCreate} noValidate>
      <header className="flex items-center justify-between overflow-hidden">
        <h2 className="text-heading-1 text-label-normal flex min-w-0 items-center gap-2 font-medium">
          {currentNode?.number && <NodeNumberBadge number={currentNode.number} />}
          <span className="min-w-0 truncate">
            {currentNode?.title ? `"${currentNode.title}"의 참조 노드` : '참조 노드'}
          </span>
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
        >
          <IconClose className="h-6 w-6" aria-hidden="true" />
        </button>
      </header>

      <div className="flex w-full flex-col gap-6">
        <ReferencedNodesList items={referencedNodes} variant={viewMode} currentNode={currentNode} onDeleteEdge={onDeleteEdge} />

        {viewMode === 'list' ? (
          <div className="flex w-full justify-end">
            <TextButton
              color="primary"
              size="small"
              leadingContent={<IconPlus />}
              onClick={openAddView}
            >
              참조할 노드 추가하기
            </TextButton>
          </div>
        ) : (
          <ReferenceNodeAddForm form={form} onCancel={closeAddView} />
        )}
      </div>
    </form>
  );
};

ReferenceNodeModalContent.displayName = 'ReferenceNodeModalContent';
