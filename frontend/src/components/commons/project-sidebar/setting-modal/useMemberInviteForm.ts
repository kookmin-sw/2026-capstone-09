'use client';

import { useCallback, useState } from 'react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 멤버 초대 입력 폼 훅.
 * - `email` / `setEmail` : TextField와 양방향 바인딩.
 * - `isValid`            : 이메일 형식 자체가 유효한지.
 * - `isInvalid`          : 사용자가 입력했지만 형식이 아닌 상태 (TextField invalid 표시용).
 * - `canSend`            : 전송 버튼 활성 여부 (=`isValid`).
 * - `buildPayload`       : `privateApi.project.inviteMember` 에 그대로 넘길 `{ email }` 형태.
 */
export const useMemberInviteForm = () => {
  const [email, setEmail] = useState('');

  const trimmed = email.trim();
  const isValid = EMAIL_PATTERN.test(trimmed);
  const isInvalid = trimmed.length > 0 && !isValid;
  const canSend = isValid;

  const buildPayload = useCallback(() => ({ email: trimmed }), [trimmed]);

  const reset = useCallback(() => {
    setEmail('');
  }, []);

  return {
    email,
    setEmail,
    isValid,
    isInvalid,
    canSend,
    buildPayload,
    reset,
  };
};
