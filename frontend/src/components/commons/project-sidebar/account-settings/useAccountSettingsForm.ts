'use client';

import { useCallback, useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { useErrorToast } from '@/hooks/useErrorToast';

interface AccountInfo {
  nickname: string;
  email: string;
  profileImageUrl?: string;
  createdAt?: string;
}

const NICKNAME_MAX_LENGTH = 20;
const AUTO_SAVE_DEBOUNCE_MS = 1000;

const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
const PROFILE_IMAGE_ACCEPT = ['image/png', 'image/jpeg', 'image/webp'] as const;

interface UseAccountSettingsFormParams {
  /** 닉네임 자동 저장 성공 시 호출. */
  onNicknameSaved?: () => void;
  /** 프로필 이미지 업로드 성공 시 호출. */
  onProfileImageUploaded?: () => void;
}

/**
 * 계정 설정 모달의 폼 상태 + 자동 저장 + 프로필 이미지 업로드를 담당하는 커스텀 훅.
 *
 * - 마운트/`reloadCounter` 변경 시 `privateApi.user.getMe` 로 계정 정보 로드.
 * - 닉네임 1초 debounce 자동 저장(`updateMe({ nickname })`).
 * - 프로필 이미지 업로드(`uploadProfileImage(file)`):
 *   - 클라이언트 사전 검증 — 5MB 이내, png/jpeg/webp (서버 거부 전에 사용자에게 토스트).
 *   - `privateApi.user.updateProfileImage({ profileImage: file })` 호출.
 *   - 응답 `data: null` 이라 URL 을 못 받아, `getMe` 를 재호출해 화면을 갱신한다.
 * - API 실패는 모두 `useErrorToast` 로 백엔드 `err.error.message` 우선 표시.
 * - 이메일은 별도 훅(`useEmailEditForm`)에서 처리. `setInfoEmail` 만 외부에서 동기화 가능하게 노출.
 */
export const useAccountSettingsForm = ({
  onNicknameSaved,
  onProfileImageUploaded,
}: UseAccountSettingsFormParams = {}) => {
  const showErrorToast = useErrorToast();
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [nickname, setNickname] = useState('');
  const [reloadCounter, setReloadCounter] = useState(0);

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
        showErrorToast(caught, '내 정보 조회에 실패했어요.');
      }
    };
    void fetchMe();
    return () => {
      cancelled = true;
    };
  }, [reloadCounter, showErrorToast]);

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
          onNicknameSaved?.();
        } catch (caught) {
          if (cancelled) return;
          showErrorToast(caught, '닉네임 저장에 실패했어요.');
        }
      };
      void saveNickname();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, canSave, onNicknameSaved, showErrorToast]);

  const reset = useCallback(() => {
    setNickname(info?.nickname ?? '');
  }, [info]);

  /** 이메일이 외부(useEmailEditForm)에서 갱신됐을 때 `info.email` 만 동기화. */
  const setInfoEmail = useCallback((nextEmail: string) => {
    setInfo((prev) => (prev ? { ...prev, email: nextEmail } : prev));
  }, []);

  /** 프로필 이미지 업로드. 클라이언트 사전 검증 → multipart 호출 → getMe 재로드. */
  const uploadProfileImage = useCallback(
    async (file: File) => {
      // 1) MIME 사전 검증
      const isAllowedType = PROFILE_IMAGE_ACCEPT.includes(
        file.type as (typeof PROFILE_IMAGE_ACCEPT)[number],
      );
      if (!isAllowedType) {
        showErrorToast(null, 'PNG·JPEG·WEBP 파일만 업로드할 수 있어요.');
        return;
      }
      // 2) 크기 사전 검증
      if (file.size > PROFILE_IMAGE_MAX_BYTES) {
        showErrorToast(null, '파일 크기는 5MB 이하여야 해요.');
        return;
      }

      try {
        await privateApi.user.updateProfileImage({ profileImage: file });
        setReloadCounter((c) => c + 1);
        onProfileImageUploaded?.();
      } catch (caught) {
        showErrorToast(caught, '프로필 이미지 업로드에 실패했어요.');
      }
    },
    [onProfileImageUploaded, showErrorToast],
  );

  return {
    info,
    nickname,
    setNickname,
    nicknameMaxLength: NICKNAME_MAX_LENGTH,
    isValidNickname,
    canSave,
    reset,
    setInfoEmail,
    uploadProfileImage,
    profileImageAcceptAttr: PROFILE_IMAGE_ACCEPT.join(','),
  };
};
