'use client';

import { useCallback, useState } from 'react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 멤버 초대 다중 입력 폼 훅.
 *
 * - `email` / `setEmail` : 현재 입력 중인 이메일.
 * - `pendingEmails`      : 사용자가 엔터로 추가해 둔 초대 대기 이메일 목록 (Chip 으로 렌더).
 * - `isCurrentValid`     : 현재 입력값이 이메일 형식이면서 아직 목록에 없는지.
 * - `isCurrentInvalid`   : 입력했지만 형식이 아닌 상태 (TextField invalid 표시용).
 * - `canSendAll`         : 전송 가능 — 목록에 1개 이상 또는 현재 입력값이 유효 (전송 시 자동 추가).
 * - `commitCurrent`      : 현재 입력값을 목록에 추가 (Enter 키, blur 등에서 호출).
 * - `removeEmail(email)` : Chip close 트리거.
 * - `buildPayloads`      : `privateApi.project.inviteMember` 에 그대로 보낼 `{ email }[]`.
 * - `reset`              : 전송 후 모달 안에서 초기화.
 */
export const useMemberInviteForm = () => {
  const [email, setEmail] = useState('');
  const [pendingEmails, setPendingEmails] = useState<readonly string[]>([]);

  const trimmed = email.trim();
  const isCurrentValid =
    EMAIL_PATTERN.test(trimmed) && !pendingEmails.includes(trimmed);
  const isCurrentInvalid = trimmed.length > 0 && !EMAIL_PATTERN.test(trimmed);

  const commitCurrent = useCallback(() => {
    if (!isCurrentValid) return false;
    setPendingEmails((prev) => [...prev, trimmed]);
    setEmail('');
    return true;
  }, [isCurrentValid, trimmed]);

  const removeEmail = useCallback((target: string) => {
    setPendingEmails((prev) => prev.filter((item) => item !== target));
  }, []);

  const canSendAll = pendingEmails.length > 0 || isCurrentValid;

  /**
   * 전송 직전에 호출 — 현재 입력값이 유효하면 목록에 추가하고 최종 목록을 반환한다.
   * 이미 전송 직전 commit 이 끝났다는 가정으로 buildPayloads 도 같은 식으로 계산한다.
   */
  const buildPayloads = useCallback(() => {
    const finalList = isCurrentValid ? [...pendingEmails, trimmed] : [...pendingEmails];
    return finalList.map((mail) => ({ email: mail }));
  }, [isCurrentValid, pendingEmails, trimmed]);

  const reset = useCallback(() => {
    setEmail('');
    setPendingEmails([]);
  }, []);

  return {
    email,
    setEmail,
    pendingEmails,
    isCurrentValid,
    isCurrentInvalid,
    canSendAll,
    commitCurrent,
    removeEmail,
    buildPayloads,
    reset,
  };
};
