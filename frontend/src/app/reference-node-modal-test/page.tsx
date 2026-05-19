'use client';

import { Button } from '@wanteddev/wds';
import { IconLink } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { useModal } from '@/components/commons/modal/ModalContext';
import {
  ReferenceNodeModalContent,
  type CreateReferenceNodePathParams,
  type ReferenceNodeCreatePayload,
  type ReferenceNodeOption,
  type ReferencedNodeItem,
} from '@/components/projects/project-detail/reference-node';
import { EXAMPLE_REFERENCE_NODE_MODAL } from '@/constants/exampleConstant';
import { useErrorToast } from '@/hooks/useErrorToast';
import {
  useCreateEdgeMutation,
  useLinkedNodesQuery,
  useNodeListQuery,
} from '@/queries/edge';

interface SubmittedReferenceNodeRequest {
  pathParams: CreateReferenceNodePathParams;
  body: ReferenceNodeCreatePayload;
}

export default function ReferenceNodeModalTestPage() {
  const { openModal, closeModal } = useModal();
  const showErrorToast = useErrorToast();
  const [submittedRequest, setSubmittedRequest] = useState<SubmittedReferenceNodeRequest | null>(
    null,
  );
  const pathParams = { projectId: EXAMPLE_REFERENCE_NODE_MODAL.projectId };

  const { data: linkedNodes } = useLinkedNodesQuery(
    EXAMPLE_REFERENCE_NODE_MODAL.projectId,
    EXAMPLE_REFERENCE_NODE_MODAL.startNodeId,
  );
  const { data: nodeList } = useNodeListQuery(EXAMPLE_REFERENCE_NODE_MODAL.projectId);
  const { mutateAsync: createEdge } = useCreateEdgeMutation(EXAMPLE_REFERENCE_NODE_MODAL.projectId);

  const handleCreate = async (payload: ReferenceNodeCreatePayload) => {
    try {
      await createEdge(payload);
      setSubmittedRequest({ pathParams, body: payload });
    } catch (err) {
      showErrorToast(err, '참조 노드 연결에 실패했어요.');
    }
  };

  const openModalWith = (
    referencedNodes: readonly ReferencedNodeItem[],
    nodeOptions: readonly ReferenceNodeOption[],
  ) => {
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ReferenceNodeModalContent
          startNodeId={EXAMPLE_REFERENCE_NODE_MODAL.startNodeId}
          referencedNodes={referencedNodes}
          nodeOptions={nodeOptions}
          onClose={closeModal}
          onCreate={handleCreate}
        />
      ),
    });
  };

  const handleOpenWithApi = () => {
    const referencedNodes = linkedNodes ?? [];
    const nodeOptions: ReferenceNodeOption[] = (nodeList ?? [])
      .filter((node) => node.nodeId !== EXAMPLE_REFERENCE_NODE_MODAL.startNodeId)
      .map((node) => ({
        nodeId: node.nodeId ?? 0,
        nodeNumber: node.number ?? '',
        nodeTitle: node.title ?? '',
      }));

    openModalWith(referencedNodes, nodeOptions);
  };

  const handleOpenWithMock = () => {
    openModalWith(
      EXAMPLE_REFERENCE_NODE_MODAL.referencedNodes,
      EXAMPLE_REFERENCE_NODE_MODAL.nodeOptions,
    );
  };

  return (
    <main className="bg-background-normal-alternative flex min-h-screen flex-col items-center justify-center gap-6 p-10">
      <div className="flex flex-col items-center gap-3">
        <Button
          variant="solid"
          color="primary"
          size="large"
          leadingContent={<IconLink />}
          onClick={handleOpenWithApi}
        >
          참조 노드 모달 (API 연결)
        </Button>
        <Button
          variant="solid"
          color="assistive"
          size="large"
          leadingContent={<IconLink />}
          onClick={handleOpenWithMock}
        >
          참조 노드 모달 (예시 목 데이터)
        </Button>
      </div>
      {submittedRequest && (
        <pre className="border-line-normal-neutral bg-background-normal-normal text-caption-1 text-label-neutral max-w-full overflow-auto rounded-xl border p-4 font-normal">
          {JSON.stringify(submittedRequest, null, 2)}
        </pre>
      )}
    </main>
  );
}
