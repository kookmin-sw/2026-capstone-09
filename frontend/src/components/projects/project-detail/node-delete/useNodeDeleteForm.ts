'use client';

import { useCallback, useState } from 'react';

interface UseNodeDeleteFormParams {
  /**
   * 삭제 대상 노드의 표시 이름. 사용자가 입력값에 정확히 동일한 이름을
   * 입력해야 삭제 액션이 활성화된다.
   */
  nodeName: string;
}

/**
 * 노드 삭제 컨펌 모달의 제출 페이로드 형태.
 *
 * 본 페이로드는 **API 바디에 들어가지 않는다.**
 * 실제 삭제 API(`privateApi.node.deleteNode(projectId, nodeId)`)는 path params만 사용하고
 * body가 없는 DELETE 요청이다. 페이로드는 호출부에서
 * - 컨펌 입력값과 노드 이름이 실제로 일치했는지 한 번 더 검사
 * - 토스트/로깅에 표시
 * 하는 용도로만 활용한다.
 */
export interface NodeDeleteConfirmPayload {
  expectedNodeName: string;
  confirmedName: string;
}

/**
 * 노드 삭제 컨펌 모달의 폼 상태·검증·payload 생성을 담당하는 커스텀 훅.
 *
 * - `nameInput` : 사용자가 입력한 노드 이름 문자열
 * - `canDelete` : 입력값이 노드 이름과 정확히 일치할 때만 `true`
 * - `isInvalid` : 사용자가 무엇인가 입력했지만 일치하지 않는 상태 (TextField invalid 표시용)
 * - `buildPayload` : 제출 시 부모 컴포넌트로 넘길 페이로드 생성 함수
 *
 * 폼 라이브러리 도입 없이 단일 텍스트 입력만 다루기 위해 plain useState 기반으로
 * 구현하되, UI 컴포넌트가 폼 상태 자체를 들고 있지 않도록 훅으로 분리한다.
 */
export const useNodeDeleteForm = ({ nodeName }: UseNodeDeleteFormParams) => {
  const [nameInput, setNameInput] = useState('');

  const trimmedInput = nameInput.trim();
  const trimmedNodeName = nodeName.trim();

  const canDelete = trimmedNodeName.length > 0 && trimmedInput === trimmedNodeName;
  const isInvalid = trimmedInput.length > 0 && !canDelete;

  const buildPayload = useCallback(
    (): NodeDeleteConfirmPayload => ({
      expectedNodeName: trimmedNodeName,
      confirmedName: trimmedInput,
    }),
    [trimmedNodeName, trimmedInput],
  );

  const reset = useCallback(() => {
    setNameInput('');
  }, []);

  return {
    nameInput,
    setNameInput,
    canDelete,
    isInvalid,
    buildPayload,
    reset,
  };
};
