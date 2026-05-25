'use client';

import { useCallback, useEffect, useState } from 'react';

import { userStorage } from '@/api/userStorage';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useCurrentUserQuery, useUpdateMeMutation, useUpdateProfileImageMutation } from '@/queries/user';

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

/**
 * 백엔드가 프로토콜 없이 `static.flowmeet.kr/users/...` 형태로 반환하는 경우 브라우저가
 * 상대 경로(`/projects/...`)로 해석해 404 가 떨어진다. `http(s)://` 또는 `//` 로 시작하지
 * 않으면 `https://` 를 보강한다.
 */
const normalizeImageUrl = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  if (/^(https?:)?\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

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
  const [nickname, setNickname] = useState('');
  // 동일 URL에 새 이미지 덮어썼을 때 브라우저가 캐시된 옛 이미지를 띄우는 문제 우회용.
  const [imageBustKey, setImageBustKey] = useState(0);

  const { data: userData } = useCurrentUserQuery();
  const { mutateAsync: updateMe } = useUpdateMeMutation();
  const { mutateAsync: updateProfileImage } = useUpdateProfileImageMutation();

  const info: AccountInfo | null = userData
    ? {
        nickname: userData.nickname ?? '',
        email: userData.email ?? '',
        profileImageUrl: normalizeImageUrl(userData.profileImageUrl),
        createdAt: userData.createdAt,
      }
    : null;

  useEffect(() => {
    if (userData) setNickname(userData.nickname ?? '');
  }, [userData]);

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
          await updateMe({ nickname: trimmed });
          if (cancelled) return;
          userStorage.setNickname(trimmed);
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
  }, [trimmed, canSave, onNicknameSaved, showErrorToast, updateMe]);

  const reset = useCallback(() => {
    setNickname(info?.nickname ?? '');
  }, [info]);

  const setInfoEmail = useCallback((_nextEmail: string) => {}, []);

  /** 프로필 이미지 업로드. 클라이언트 사전 검증 → multipart 호출 → 캐시 무효화. */
  const uploadProfileImage = useCallback(
    async (file: File) => {
      const isAllowedType = PROFILE_IMAGE_ACCEPT.includes(
        file.type as (typeof PROFILE_IMAGE_ACCEPT)[number],
      );
      if (!isAllowedType) {
        showErrorToast(null, 'PNG·JPEG·WEBP 파일만 업로드할 수 있어요.');
        return;
      }
      if (file.size > PROFILE_IMAGE_MAX_BYTES) {
        showErrorToast(null, '파일 크기는 5MB 이하여야 해요.');
        return;
      }

      try {
        await updateProfileImage(file);
        setImageBustKey(Date.now());
        onProfileImageUploaded?.();
      } catch (caught) {
        showErrorToast(caught, '프로필 이미지 업로드에 실패했어요.');
      }
    },
    [onProfileImageUploaded, showErrorToast, updateProfileImage],
  );

  const triggerReload = useCallback(() => {}, []);

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
    triggerReload,
    imageBustKey,
  };
};
