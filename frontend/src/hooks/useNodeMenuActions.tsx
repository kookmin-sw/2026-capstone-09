'use client';

import { useEffect } from 'react';

import { useModal } from '@/components/commons/modal/ModalContext';
import { Loading } from '@/components/commons/loading/Loading';
import { MeetingCreateModalContent } from '@/components/projects/node-flow/MeetingCreateModalContent';
import { MeetingDeleteConfirmContent } from '@/components/projects/project-detail/meeting-delete/MeetingDeleteConfirmContent';
import { NodeDeleteConfirmContent } from '@/components/projects/project-detail/node-delete/NodeDeleteConfirmContent';
import { ReferenceNodeModalContent } from '@/components/projects/project-detail/reference-node/ReferenceNodeModalContent';
import { useCreateEdgeMutation, useLinkedNodesQuery, useNodeListQuery } from '@/queries/edge';
import { useCreateMeetingMutation } from '@/queries/meeting';
import { useDeleteMeetingMutation } from '@/queries/meetingDelete';
import { useProjectMembersQuery } from '@/queries/member';
import { useNodeDetailQuery } from '@/queries/node';
import { useDeleteNodeMutation } from '@/queries/nodeDelete';
import { useErrorToast } from './useErrorToast';

// 리스트를 받아야 하기 때문에 모달이 열릴 때만 마운트되어 쿼리를 실행
function ConnectedMeetingCreateModal({
  projectId,
  nodeId,
  badge,
  nodeTitle,
  onClose,
}: {
  projectId: number;
  nodeId: number;
  badge: string;
  nodeTitle: string;
  onClose: () => void;
}) {
  const { data: members = [] } = useProjectMembersQuery(projectId);
  const { mutate: createMeeting } = useCreateMeetingMutation(projectId, nodeId);
  const showErrorToast = useErrorToast();

  return (
    <MeetingCreateModalContent
      nodeBadge={badge}
      nodeTitle={nodeTitle}
      participantOptions={members.map((m) => ({
        id: m.userId ?? 0,
        name: m.nickname ?? '',
        email: m.email,
      }))}
      onClose={onClose}
      onCreate={(payload) => {
        createMeeting(payload, {
          onSuccess: onClose,
          onError: (err) => showErrorToast(err, '회의 생성에 실패했어요.'),
        });
      }}
    />
  );
}

function ConnectedMeetingDeleteModal({
  projectId,
  nodeId,
  onClose,
}: {
  projectId: number;
  nodeId: number;
  onClose: () => void;
}) {
  const { data: nodeDetail, isLoading } = useNodeDetailQuery(projectId, nodeId);
  const { mutate: deleteMeeting } = useDeleteMeetingMutation(projectId);
  const showErrorToast = useErrorToast();
  const meetingId = nodeDetail?.meeting?.meetingId;

  useEffect(() => {
    if (!isLoading && !meetingId) onClose();
  }, [isLoading, meetingId, onClose]);

  if (isLoading || !meetingId) return <Loading />;

  return (
    <MeetingDeleteConfirmContent
      onConfirm={() => {
        deleteMeeting(
          { nodeId, meetingId },
          {
            onSuccess: onClose,
            onError: (err) => showErrorToast(err, '회의 삭제에 실패했어요.'),
          },
        );
      }}
      onCancel={onClose}
    />
  );
}

function ConnectedReferenceNodeModal({
  projectId,
  nodeId,
  onClose,
}: {
  projectId: number;
  nodeId: number;
  onClose: () => void;
}) {
  const { data: linkedNodes = [] } = useLinkedNodesQuery(projectId, nodeId);
  const { data: nodeList = [] } = useNodeListQuery(projectId);
  const { mutate: createEdge } = useCreateEdgeMutation(projectId);
  const showErrorToast = useErrorToast();

  const nodeOptions = nodeList
    .filter((n) => n.nodeId !== nodeId)
    .map((n) => ({ nodeId: n.nodeId ?? 0, nodeNumber: n.number ?? '', nodeTitle: n.title ?? '' }));

  return (
    <ReferenceNodeModalContent
      startNodeId={nodeId}
      referencedNodes={linkedNodes}
      nodeOptions={nodeOptions}
      onClose={onClose}
      onCreate={(payload) => {
        createEdge(payload, {
          onSuccess: onClose,
          onError: (err) => showErrorToast(err, '참조 노드 연결에 실패했어요.'),
        });
      }}
    />
  );
}

interface NodeMenuActionsOptions {
  nodeId: number;
  projectId: number;
  nodeTitle?: string;
  nodeNumber?: number | string;
  onBeforeAction?: () => void;
  onDeleteSuccess?: () => void;
}

export function useNodeMenuActions({
  nodeId,
  projectId,
  nodeTitle = '',
  nodeNumber,
  onBeforeAction,
  onDeleteSuccess,
}: NodeMenuActionsOptions) {
  const { openModal, closeModal } = useModal();
  const { mutate: deleteNode } = useDeleteNodeMutation(projectId);
  const showErrorToast = useErrorToast();

  const before = () => onBeforeAction?.();
  const badge = `#${nodeNumber ?? nodeId}`;

  return {
    onCreateSubNode: () => {
      before();
      // TODO: 서브 노드 생성
    },
    onCreateMeeting: () => {
      before();
      openModal({
        closeOnBackdrop: true,
        content: (
          <ConnectedMeetingCreateModal
            projectId={projectId}
            nodeId={nodeId}
            badge={badge}
            nodeTitle={nodeTitle}
            onClose={closeModal}
          />
        ),
      });
    },
    onEditMeeting: () => {
      before();
      // 회의 수정 모달 -> 훅 외부에서 주입
    },
    onDeleteMeeting: () => {
      before();
      openModal({
        closeOnBackdrop: true,
        content: (
          <ConnectedMeetingDeleteModal projectId={projectId} nodeId={nodeId} onClose={closeModal} />
        ),
      });
    },
    onCreateReference: () => {
      before();
      openModal({
        closeOnBackdrop: true,
        content: (
          <ConnectedReferenceNodeModal projectId={projectId} nodeId={nodeId} onClose={closeModal} />
        ),
      });
    },
    onDelete: () => {
      before();
      openModal({
        closeOnBackdrop: true,
        content: (
          <NodeDeleteConfirmContent
            nodeName={nodeTitle}
            onConfirm={() => {
              deleteNode(nodeId, {
                onSuccess: () => {
                  closeModal();
                  onDeleteSuccess?.();
                },
                onError: (err) => showErrorToast(err, '노드 삭제에 실패했어요.'),
              });
            }}
            onClose={closeModal}
          />
        ),
      });
    },
  };
}
