'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseProjectInfoFormParams {
  /** 서버에서 받은 현재 프로젝트 이름. 변경 비교 기준이 된다. */
  initialName: string;
  /** 입력 가능한 최대 글자 수. */
  maxLength?: number;
}

// 디자인 시안 기준 50자.
const DEFAULT_NAME_MAX_LENGTH = 50;

/**
 * 프로젝트 설정 패널의 "이름 수정" 폼 훅.
 * - `name` / `setName` : TextField와 양방향 바인딩.
 * - `isValid` : 이름이 비어있지 않은지.
 * - `canSave` : 유효 + 기존 이름과 다른 경우.
 * - `buildPayload` : `privateApi.project.updateProject` 에 그대로 보낼 `{ name }` 형태.
 *
 * `initialName`이 비동기로 들어오는 경우(첫 fetch 완료 시점)에도 동기화되도록
 * `useEffect`로 prop 변경을 반영한다.
 */
export const useProjectInfoForm = ({
  initialName,
  maxLength = DEFAULT_NAME_MAX_LENGTH,
}: UseProjectInfoFormParams) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const trimmed = name.trim();
  const isValid = trimmed.length > 0 && trimmed.length <= maxLength;
  const canSave = isValid && trimmed !== initialName.trim();

  const buildPayload = useCallback(() => ({ name: trimmed }), [trimmed]);

  const reset = useCallback(() => {
    setName(initialName);
  }, [initialName]);

  return {
    name,
    setName,
    isValid,
    canSave,
    maxLength,
    buildPayload,
    reset,
  };
};
