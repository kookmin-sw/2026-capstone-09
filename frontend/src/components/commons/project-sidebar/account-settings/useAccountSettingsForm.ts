'use client';

import { useCallback, useEffect, useState } from 'react';

import { privateApi } from '@/api';

interface AccountInfo {
  nickname: string;
  email: string;
  profileImageUrl?: string;
  createdAt?: string;
}

const NICKNAME_MAX_LENGTH = 20;
const AUTO_SAVE_DEBOUNCE_MS = 1000;

/**
 * 계정 설정 모달의 폼 상태 + 자동 저장을 담당하는 커스텀 훅.
 *
 * - 마운트 시 `privateApi.user.getMe` 로 현재 계정 정보 로드 → `info` / `nickname` / `email` 동기화.
 * - 닉네임은 별도 저장 버튼 없이 1초 debounce 후 자동 저장(`updateMe`).
 *   - 빈 값/공백/길이 초과는 저장하지 않는다.
 *   - 저장 성공 시 외부에 토스트를 띄울 수 있도록 `onSaveSuccess` 콜백을 받는다.
 * - 이메일은 백엔드에 별도 인증 플로우(인증번호 발송/검증) API가 없어 본 PR에서는 readonly 표시만.
 *   `updateMe` 의 `email` 필드는 서버측 인증 파이프라인이 들어온 다음 호출하도록 둔다.
 */
interface UseAccountSettingsFormParams {
  /** 닉네임 자동 저장 성공 시 호출. 부모에서 토스트 등으로 활용. */
  onSaveSuccess?: () => void;
}

export const useAccountSettingsForm = ({ onSaveSuccess }: UseAccountSettingsFormParams = {}) => {
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchMe = async () => {
      try {
        const response = await privateApi.user.getMe();
        if (cancelled) return;
        const data = response.data.data;
        const next: AccountInfo = {
          nickname: data?.nickname ?? '',
          email: data?.email ?? '',
          profileImageUrl: data?.profileImageUrl,
          createdAt: data?.createdAt,
        };
        setInfo(next);
        setNickname(next.nickname);
      } catch (caught) {
        if (cancelled) return;
        console.error('내 정보 조회에 실패했어요.', caught);
      }
    };
    void fetchMe();
    return () => {
      cancelled = true;
    };
  }, []);

  const trimmed = nickname.trim();
  const isValidNickname = trimmed.length > 0 && trimmed.length <= NICKNAME_MAX_LENGTH;
  const isChanged = info !== null && trimmed !== info.nickname.trim();
  const canSave = isValidNickname && isChanged;

  // 닉네임 자동 저장
  useEffect(() => {
    if (!canSave) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      const saveNickname = async () => {
        try {
          await privateApi.user.updateMe({ nickname: trimmed });
          if (cancelled) return;
          setInfo((prev) => (prev ? { ...prev, nickname: trimmed } : prev));
          onSaveSuccess?.();
        } catch (caught) {
          if (cancelled) return;
          console.error('닉네임 저장에 실패했어요.', caught);
        }
      };
      void saveNickname();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, canSave, onSaveSuccess]);

  const reset = useCallback(() => {
    setNickname(info?.nickname ?? '');
  }, [info]);

  /** 이메일이 외부(useEmailEditForm)에서 갱신됐을 때 `info.email` 만 동기화. */
  const setInfoEmail = useCallback((nextEmail: string) => {
    setInfo((prev) => (prev ? { ...prev, email: nextEmail } : prev));
  }, []);

  return {
    info,
    nickname,
    setNickname,
    nicknameMaxLength: NICKNAME_MAX_LENGTH,
    isValidNickname,
    canSave,
    reset,
    setInfoEmail,
  };
};
