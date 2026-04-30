'use client';

import { useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { NodeDeleteConfirmContent } from '@/components/projects/project-detail/node-delete';
import type { NodeDeleteConfirmPayload } from '@/components/projects/project-detail/node-delete';
import { EXAMPLE_NODE_DELETE_TEST } from '@/constants/exampleConstant';
import { cn } from '@/utils/cn';

/**
 * 노드 삭제 컨펌 모달 동작 확인용 임시 페이지.
 *
 * - 실제 노드플로우 컨텍스트 메뉴/툴바에는 연결하지 않는다 (4대 핵심 모달이 아니므로
 *   별도 테스트 페이지에서만 띄우도록 한다).
 * - 공통 다이얼로그(`useDialog`) 위에 도메인 컴포넌트(`NodeDeleteConfirmContent`)를
 *   올려 백드롭/ESC/외부 클릭 닫힘은 공통 컴포넌트에 위임한다.
 */
const NodeDeleteModalTestPage = () => {
  const { openDialog, closeDialog } = useDialog();
  const [lastPayload, setLastPayload] = useState<{
    projectId: number;
    nodeId: number;
    payload: NodeDeleteConfirmPayload;
  } | null>(null);

  const handleOpenDialog = (node: { id: number; name: string }) => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <NodeDeleteConfirmContent
          nodeName={node.name}
          onConfirm={(payload) => {
            // 실제 연결 시 호출 예 (이미 생성된 메서드):
            //   privateApi.node.deleteNode(EXAMPLE_NODE_DELETE_TEST.projectId, node.id)
            //   - DELETE /v1/projects/{projectId}/nodes/{nodeId}
            //   - 성공: { status: 200, code: 'OK', message: '...', data: null }
            //   - 실패 code 'NODE_NOT_FOUND' 일 때 토스트 처리
            // 본 테스트 페이지에서는 호출 없이 입력만 화면에 표시한다.
            setLastPayload({
              projectId: EXAMPLE_NODE_DELETE_TEST.projectId,
              nodeId: node.id,
              payload,
            });
            closeDialog();
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
