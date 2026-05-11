'use client';

import { useCallback, useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { useErrorToast } from '@/hooks/useErrorToast';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFICATION_CODE_LENGTH = 6;

interface UseEmailEditFormParams {
  /** 현재 닉네임. 이메일 변경 시 `updateMe` 페이로드에 함께 보낸다. */
  nickname: string;
  /** 변경 성공 시 호출(부모에서 `info.email` 동기화·토스트 등). */
  onChanged: (nextEmail: string) => void;
  /** 인증 코드 발송 성공 시 호출. */
  onCodeSent?: () => void;
}

/**
 * 계정 설정 모달의 이메일 편집/인증/변경 플로우 폼 훅.
 *
 * - 편집 모드 토글: `isEditing` / `startEdit` / `cancelEdit`.
 * - 이메일 형식 검증: `isEmailInvalid`.
 * - 인증 코드 발송: `requestVerification` → `sendEmailVerification({ email })`.
 *   성공 시 `onCodeSent` 콜백, 실패 시 백엔드 메시지 토스트.
 * - 코드 검증: `verificationCode`가 6자리가 되는 순간 자동으로 `verifyEmail({ email, code })`
 *   호출 → 성공이면 `isVerified=true`, 실패면 false 유지.
 * - 변경 적용: `applyChange` → `updateMe({ nickname, email })` 호출.
 *   에러는 `useErrorToast` 로 백엔드 메시지 우선 표시.
 */
export const useEmailEditForm = ({ nickname, onChanged, onCodeSent }: UseEmailEditFormParams) => {
  const showErrorToast = useErrorToast();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const trimmedEmail = email.trim();
  const trimmedCode = verificationCode.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
  const isEmailInvalid = trimmedEmail.length > 0 && !isEmailValid;
  const canRequestVerification = isEmailValid && !isVerified && !isVerifying;
  const canApplyChange = isEmailValid && isVerified;

  const resetEditState = useCallback(() => {
    setIsEditing(false);
    setEmail('');
    setVerificationCode('');
    setIsVerified(false);
    setIsVerifying(false);
  }, []);

  const startEdit = useCallback((initialEmail: string) => {
    setEmail(initialEmail);
    setVerificationCode('');
    setIsVerified(false);
    setIsVerifying(false);
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    resetEditState();
  }, [resetEditState]);

  const requestVerification = useCallback(async () => {
    if (!canRequestVerification) return;
    try {
      await privateApi.user.sendEmailVerification({ email: trimmedEmail });
      // 새 코드 발송 시 이전 입력 초기화.
      setVerificationCode('');
      setIsVerified(false);
      onCodeSent?.();
    } catch (caught) {
      showErrorToast(caught, '인증 코드 발송에 실패했어요.');
    }
  }, [canRequestVerification, trimmedEmail, onCodeSent, showErrorToast]);

  // 코드가 6자리가 되는 순간 자동 검증.
  useEffect(() => {
    if (!isEmailValid || isVerified) return;
    if (trimmedCode.length !== VERIFICATION_CODE_LENGTH) return;

    let cancelled = false;
    const verify = async () => {
      setIsVerifying(true);
      try {
        await privateApi.user.verifyEmail({ email: trimmedEmail, code: trimmedCode });
        if (cancelled) return;
        setIsVerified(true);
      } catch (caught) {
        if (cancelled) return;
        setIsVerified(false);
        showErrorToast(caught, '인증 코드가 올바르지 않아요.');
      } finally {
        if (!cancelled) setIsVerifying(false);
      }
    };
    void verify();

    return () => {
      cancelled = true;
    };
  }, [trimmedCode, trimmedEmail, isEmailValid, isVerified, showErrorToast]);

  const applyChange = useCallback(async () => {
    if (!canApplyChange) return;
    try {
      await privateApi.user.updateMe({ nickname, email: trimmedEmail });
      onChanged(trimmedEmail);
      resetEditState();
    } catch (caught) {
      showErrorToast(caught, '이메일 변경에 실패했어요.');
    }
  }, [canApplyChange, nickname, trimmedEmail, onChanged, resetEditState, showErrorToast]);

  return {
    isEditing,
    email,
    setEmail,
    isEmailInvalid,
    canRequestVerification,
    verificationCode,
    setVerificationCode,
    isVerified,
    isVerifying,
    canApplyChange,
    startEdit,
    cancelEdit,
    requestVerification,
    applyChange,
  };
};
