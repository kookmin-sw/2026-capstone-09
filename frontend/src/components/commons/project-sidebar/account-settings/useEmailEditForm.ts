'use client';

import { useCallback, useState } from 'react';

import { privateApi } from '@/api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UseEmailEditFormParams {
  /** 현재 닉네임. 이메일 변경 시 `updateMe` 페이로드에 함께 보낸다. */
  nickname: string;
  /** 변경 성공 시 호출(부모에서 `info.email` 동기화·토스트 등). */
  onChanged: (nextEmail: string) => void;
}

/**
 * 계정 설정 모달의 이메일 편집/인증/변경 플로우 폼 훅.
 *
 * - 편집 모드 토글: `isEditing` / `startEdit` / `cancelEdit`.
 * - 이메일 형식 검증: `isEmailValid` / `isEmailInvalid`.
 * - 인증번호 발송·검증: 백엔드 인증 API가 generated 되지 않아 본 PR에선 클라이언트 fake.
 *   `requestVerification` 호출 시 즉시 인증 성공으로 표시한다.
 *   (TODO: privateApi.user.requestEmailVerification / verifyEmailCode 등 추가 후 연결)
 * - 변경 적용: `applyChange` → `privateApi.user.updateMe({ nickname, email })` 호출.
 */
export const useEmailEditForm = ({ nickname, onChanged }: UseEmailEditFormParams) => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
  const isEmailInvalid = trimmedEmail.length > 0 && !isEmailValid;
  const canRequestVerification = isEmailValid && !isVerified;
  const canApplyChange = isEmailValid && isVerified && verificationCode.trim().length > 0;

  const resetEditState = useCallback(() => {
    setIsEditing(false);
    setEmail('');
    setVerificationCode('');
    setIsVerified(false);
  }, []);

  const startEdit = useCallback((initialEmail: string) => {
    setEmail(initialEmail);
    setVerificationCode('');
    setIsVerified(false);
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    resetEditState();
  }, [resetEditState]);

  const requestVerification = useCallback(() => {
    if (!canRequestVerification) return;
    // TODO: privateApi.user.requestEmailVerification(...) 생성 후 연결.
    //       현재는 클라이언트 측 fake 인증 — 즉시 성공 표시.
    setIsVerified(true);
  }, [canRequestVerification]);

  const applyChange = useCallback(async () => {
    if (!canApplyChange) return;
    try {
      await privateApi.user.updateMe({ nickname, email: trimmedEmail });
      onChanged(trimmedEmail);
      resetEditState();
    } catch (caught) {
      console.error('이메일 변경에 실패했어요.', caught);
    }
  }, [canApplyChange, nickname, trimmedEmail, onChanged, resetEditState]);

  return {
    isEditing,
    email,
    setEmail,
    isEmailInvalid,
    canRequestVerification,
    verificationCode,
    setVerificationCode,
    isVerified,
    canApplyChange,
    startEdit,
    cancelEdit,
    requestVerification,
    applyChange,
  };
};
