'use client';

import { useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { NodeDeleteConfirmContent } from '@/components/projects/project-detail/node-delete';
import type { NodeDeleteConfirmPayload } from '@/components/projects/project-detail/node-delete';
import { EXAMPLE_NODE_DELETE_TEST } from '@/constants/exampleConstant';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useDeleteNodeMutation } from '@/queries/nodeDelete';
import { cn } from '@/utils/cn';

const NodeDeleteModalTestPage = () => {
  const { openDialog, closeDialog } = useDialog();
  const showErrorToast = useErrorToast();
  const [lastPayload, setLastPayload] = useState<{
    projectId: number;
    nodeId: number;
    payload: NodeDeleteConfirmPayload;
  } | null>(null);

  const { mutateAsync: deleteNode } = useDeleteNodeMutation(EXAMPLE_NODE_DELETE_TEST.projectId);

  const handleOpenDialog = (node: { id: number; name: string }) => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <NodeDeleteConfirmContent
          nodeName={node.name}
          onConfirm={async (payload) => {
            try {
              await deleteNode(node.id);
              setLastPayload({
                projectId: EXAMPLE_NODE_DELETE_TEST.projectId,
                nodeId: node.id,
                payload,
              });
              closeDialog();
            } catch (err) {
              showErrorToast(err, '노드 삭제에 실패했어요.');
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  return (
    <main className="bg-background-normal-normal min-h-screen w-full px-6 py-10">
      <div className="mx-auto flex w-full max-w-160 flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-heading-1 text-label-normal font-medium">
            노드 삭제 모달 테스트
          </h1>
          <p className="text-body-2 text-label-alternative">
            아래 노드 카드 중 하나를 눌러 컨펌 모달이 정상적으로 열리는지 확인합니다. 입력값이
            노드 이름과 정확히 일치할 때만 삭제 버튼이 활성화됩니다.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          {EXAMPLE_NODE_DELETE_TEST.candidates.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => handleOpenDialog(node)}
              className={cn(
                'border-line-normal-normal bg-background-elevated-normal flex flex-col gap-1 rounded-xl border p-4 text-left',
                'hover:border-line-normal-strong hover:shadow-sm',
                'focus-visible:border-primary-40 outline-none',
              )}
            >
              <span className="text-caption-1 text-label-alternative">#{node.id}</span>
              <span className="text-body-1 text-label-normal font-medium">{node.name}</span>
            </button>
          ))}
        </section>

        <section
          className="border-line-normal-neutral bg-background-normal-alternative flex flex-col gap-2 rounded-xl border p-4"
          aria-live="polite"
        >
          <h2 className="text-label-1 text-label-strong font-medium">최근 제출 결과</h2>
          {lastPayload ? (
            <pre className="text-caption-1 text-label-neutral whitespace-pre-wrap break-all">
              {JSON.stringify(lastPayload, null, 2)}
            </pre>
          ) : (
            <p className="text-caption-1 text-label-alternative">
              아직 삭제 컨펌이 실행되지 않았어요.
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default NodeDeleteModalTestPage;
