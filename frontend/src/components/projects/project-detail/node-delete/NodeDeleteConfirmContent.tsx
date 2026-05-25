'use client';

import { TextField } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';

import { cn } from '@/utils/cn';

import {
  useNodeDeleteForm,
  type NodeDeleteConfirmPayload,
} from './useNodeDeleteForm';

interface NodeDeleteConfirmContentProps {
  /** 삭제 대상 노드의 이름. placeholder · 검증값 양쪽으로 사용된다. */
  nodeName: string;
  /** 입력값이 일치한 상태에서 삭제 버튼을 눌렀을 때 호출. */
  onConfirm: (payload: NodeDeleteConfirmPayload) => void;
  /** 닫기 버튼·외부에서 모달을 닫을 때 호출. */
  onClose: () => void;
}

/**
 * 노드 삭제 컨펌 모달 콘텐츠.
 *
 * - 백드롭/ESC/외부 클릭 닫힘은 공통 다이얼로그(`useDialog` + `commons/custom-dialog`)에 위임한다.
 * - 폼 상태·검증·페이로드 생성은 `useNodeDeleteForm` 훅에 분리해 둔다.
 * - 실제 삭제 API 호출은 본 컴포넌트에서 하지 않고 부모에게 `onConfirm`으로 위임한다.
 */
export const NodeDeleteConfirmContent = ({
  nodeName,
  onConfirm,
  onClose,
}: NodeDeleteConfirmContentProps) => {
  const { nameInput, setNameInput, canDelete, isInvalid, buildPayload } =
    useNodeDeleteForm({ nodeName });

  const handleConfirmClick = () => {
    if (!canDelete) return;
    // 실제 삭제 호출은 본 컴포넌트에서 하지 않고 부모(`useProjectDetailActions` 등)에서
    // 이미 생성된 `privateApi.node.deleteNode(projectId, nodeId)` 메서드에 연결한다.
    //  - path params: projectId(number), nodeId(number)
    //  - 성공 시 `{ status, code, message, data: null }` 응답 (data는 사용하지 않음)
    //  - 에러 코드 `NODE_NOT_FOUND` 는 호출부에서 토스트/리트라이 등으로 처리
    // payload(`expectedNodeName`, `confirmedName`)는 API 바디가 아니라 클라이언트 검증·로깅용.
    onConfirm(buildPayload());
  };

  return (
    <div className="flex w-full flex-col gap-4 pb-2">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-heading-2 text-label-normal flex-1 font-medium">
          노드를 삭제하시겠어요?
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-label-alternative hover:text-label-neutral flex h-6 w-6 shrink-0 items-center justify-center border-none bg-transparent p-0"
        >
          <IconClose className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <p className="text-body-2 text-label-alternative whitespace-pre-line">
        노드를 삭제하시면 복구할 수 없으며, 모든 정보가 영구적으로 사라져요. 계속 진행하려면 아래
        노드 이름을 입력해 주세요.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-label-2 text-label-alternative font-normal">
          삭제할 노드:{' '}
          <span className="text-label-normal font-semibold break-all">{nodeName}</span>
        </p>
        <TextField
          id="node-delete-confirm-name"
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
          placeholder={nodeName}
          width="100%"
          invalid={isInvalid}
        />
      </div>

      <button
        type="button"
        disabled={!canDelete}
        onClick={handleConfirmClick}
        className={cn(
          'text-label-1 flex h-12 w-full items-center justify-center rounded-lg font-medium outline-none transition-colors duration-150',
          canDelete
            ? 'bg-status-negative text-static-white hover:opacity-90 active:opacity-80'
            : 'bg-interaction-disable text-label-disable cursor-not-allowed',
        )}
      >
        노드 삭제하기
      </button>
    </div>
  );
};

NodeDeleteConfirmContent.displayName = 'NodeDeleteConfirmContent';
