'use client';

import { useCallback } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { useModal } from '@/components/commons/modal/ModalContext';
import { MeetingCreateModalContent } from '@/components/projects/project-detail/MeetingCreateModalContent';
import { MultiNodeSummaryModalContent } from '@/components/projects/project-detail/multi-node-summary/MultiNodeSummaryModalContent';
import type {
  MultiNodeSummaryNode,
  MultiNodeSummaryResult,
} from '@/components/projects/project-detail/multi-node-summary/types';
import { NodeDeleteConfirmContent } from '@/components/projects/project-detail/NodeDeleteConfirmContent';

/**
 * `/projects/[projectId]` 페이지에서 노드에 대해 수행하는 모달/다이얼로그 액션들을
 * 한 훅에 모아둔다. 페이지 컴포넌트가 JSX에 집중할 수 있도록 UI 상태가 아닌
 * "특정 노드에 대해 어떤 모달을 여는가" 수준의 함수만 외부에 노출한다.
 */
export interface ProjectDetailActionNode {
  id: string;
  badge: string;
  title: string;
}

interface UseProjectDetailActionsParams {
  node: ProjectDetailActionNode | null;
  onNodeDeleted: () => void;
  summaryNodes: readonly MultiNodeSummaryNode[];
  summaryResult: MultiNodeSummaryResult;
}

export const useProjectDetailActions = ({
  node,
  onNodeDeleted,
  summaryNodes,
  summaryResult,
}: UseProjectDetailActionsParams) => {
  const { openDialog, closeDialog } = useDialog();
  const { openModal, closeModal } = useModal();
  const showToast = usePositionedToast();

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!node) return;
      openDialog({
        closeOnBackdrop: true,
        closeOnEsc: true,
        content: (
          <NodeDeleteConfirmContent
            nodeName={node.title}
            onConfirm={() => {
              closeDialog();
              onNodeDeleted();
              showToast({
                content: '노드를 삭제했어요',
                variant: 'normal',
                placement: 'top-center',
                duration: 'short',
              });
            }}
            onClose={closeDialog}
          />
        ),
      });
    },
    [node, openDialog, closeDialog, onNodeDeleted, showToast],
  );

  const handleOpenMultiNodeSummaryModal = useCallback(() => {
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <MultiNodeSummaryModalContent
          nodes={summaryNodes}
          result={summaryResult}
          onClose={closeModal}
          onDownloadClick={() => {
            showToast({
              content: '요약을 다운로드했어요',
              variant: 'normal',
              placement: 'bottom-left',
              duration: 'short',
            });
          }}
        />
      ),
    });
  }, [openModal, closeModal, summaryNodes, summaryResult, showToast]);

  const handleOpenMeetingCreateModal = useCallback(() => {
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <MeetingCreateModalContent
          nodeBadge={node?.badge ?? '#1'}
          nodeTitle={node?.title ?? '디자인 회의일걸요?'}
          onClose={closeModal}
          onCreate={() => {
            closeModal();
            showToast({
              content: '회의를 생성했어요',
              variant: 'normal',
              placement: 'top-center',
              duration: 'short',
            });
          }}
        />
      ),
    });
  }, [openModal, closeModal, node, showToast]);

  return {
    handleNodeContextMenu,
    handleOpenMultiNodeSummaryModal,
    handleOpenMeetingCreateModal,
  };
};
