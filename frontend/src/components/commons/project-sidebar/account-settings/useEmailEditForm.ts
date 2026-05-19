'use client';

import { useCallback, useState } from 'react';

import { useErrorToast } from '@/hooks/useErrorToast';
import { useSendEmailVerificationMutation, useUpdateMeMutation, useVerifyEmailMutation } from '@/queries/user';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFICATION_CODE_LENGTH = 6;

interface UseEmailEditFormParams {
  /** 현재 닉네임. 이메일 변경 시 `updateMe` 페이로드에 함께 보낸다. */
  nickname: string;
  /** 변경 성공 시 호출(부모에서 `info.email` 동기화·토스트 등). */
  onChanged: (nextEmail: string) => void;
  /** 인증 코드 발송 성공 시 호출. */
  onCodeSent?: () => void;
  /** 인증번호 검증 성공 시 호출. */
  onVerified?: () => void;
}

/**
 * 계정 설정 모달의 이메일 편집/인증/변경 플로우 폼 훅.
 *
 * - 편집 모드 토글: `isEditing` / `startEdit` / `cancelEdit`.
 * - 이메일 형식 검증: `isEmailInvalid`.
 * - 인증 코드 발송: `requestVerification` → `sendEmailVerification({ email })`.
 * - 코드 검증: `verifyCode` → `verifyEmail({ email, code })`.
 *   인증번호는 6자리 고정. 입력 길이가 6일 때만 `canVerifyCode=true`.
 *   실패 시 `useErrorToast` 로 백엔드 메시지(없으면 fallback) 토스트.
 * - 변경 적용: `applyChange` → `updateMe({ nickname, email })`.
 *   응답의 email 을 우선 반영해 백엔드 정규화 값과 동기화한다.
 */
export const useEmailEditForm = ({
  nickname,
  onChanged,
  onCodeSent,
  onVerified,
}: UseEmailEditFormParams) => {
  const showErrorToast = useErrorToast();
  const { mutateAsync: sendVerification } = useSendEmailVerificationMutation();
  const { mutateAsync: verifyEmailMutation } = useVerifyEmailMutation();
  const { mutateAsync: updateMe } = useUpdateMeMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCodeState] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const trimmedEmail = email.trim();
  const trimmedCode = verificationCode.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
  const isEmailInvalid = trimmedEmail.length > 0 && !isEmailValid;
  const canRequestVerification = isEmailValid && !isVerified && !isVerifying && !isSending;
  const canVerifyCode =
    isEmailValid &&
    trimmedCode.length === VERIFICATION_CODE_LENGTH &&
    !isVerified &&
    !isVerifying;
  const canApplyChange = isEmailValid && isVerified;

  /** 인증번호는 6자리 숫자만 허용. 더 길게 입력해도 잘라 저장한다. */
  const setVerificationCode = useCallback((next: string) => {
    const numericOnly = next.replace(/\D/g, '').slice(0, VERIFICATION_CODE_LENGTH);
    setVerificationCodeState(numericOnly);
  }, []);

  const resetEditState = useCallback(() => {
    setIsEditing(false);
    setEmail('');
    setVerificationCodeState('');
    setIsVerified(false);
    setIsVerifying(false);
    setIsSending(false);
  }, []);

  const startEdit = useCallback((initialEmail: string) => {
    setEmail(initialEmail);
    setVerificationCodeState('');
    setIsVerified(false);
    setIsVerifying(false);
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    resetEditState();
  }, [resetEditState]);

  const requestVerification = useCallback(async () => {
    if (!canRequestVerification) return;
    setIsSending(true);
    try {
      await sendVerification(trimmedEmail);
      setVerificationCodeState('');
      setIsVerified(false);
      onCodeSent?.();
    } catch (caught) {
      showErrorToast(caught, '인증 코드 발송에 실패했어요.');
    } finally {
      setIsSending(false);
    }
  }, [canRequestVerification, trimmedEmail, onCodeSent, showErrorToast, sendVerification]);

  const verifyCode = useCallback(async () => {
    if (!canVerifyCode) return;
    setIsVerifying(true);
    try {
      await verifyEmailMutation({ email: trimmedEmail, code: trimmedCode });
      setIsVerified(true);
      onVerified?.();
    } catch (caught) {
      setIsVerified(false);
      showErrorToast(caught, '인증 코드가 올바르지 않아요.');
    } finally {
      setIsVerifying(false);
    }
  }, [canVerifyCode, trimmedEmail, trimmedCode, onVerified, showErrorToast, verifyEmailMutation]);

  const applyChange = useCallback(async () => {
    if (!canApplyChange) return;
    try {
      const response = await updateMe({ nickname, email: trimmedEmail });
      const updatedEmail = response.data.data?.email ?? trimmedEmail;
      onChanged(updatedEmail);
      resetEditState();
    } catch (caught) {
      showErrorToast(caught, '이메일 변경에 실패했어요.');
    }
  }, [canApplyChange, nickname, trimmedEmail, onChanged, resetEditState, showErrorToast, updateMe]);

  return {
    isEditing,
    email,
    setEmail,
    isEmailInvalid,
    isSending,
    canRequestVerification,
    verificationCode,
    setVerificationCode,
    isVerified,
    isVerifying,
    canVerifyCode,
    canApplyChange,
    startEdit,
    cancelEdit,
    requestVerification,
    verifyCode,
    applyChange,
  };
};
