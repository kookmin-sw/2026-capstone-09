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

const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
const PROFILE_IMAGE_ACCEPT = ['image/png', 'image/jpeg', 'image/webp'] as const;

/**
 * 백엔드 envelope 형태에서 에러 코드를 안전하게 꺼낸다.
 *
 * http-client 가 `!response.ok` 일 때 fetch `Response` 자체를 throw 하는데,
 * 그 객체에 `error` / `data` / `status` enumerable 속성을 덧붙인 형태라
 * `console.error(caught)` 에는 prototype 속성이 빠져 `{}` 처럼 보일 수 있다.
 * 이 함수는 envelope 의 `code`, 혹은 본문이 root 에 있는 `code` 둘 다 본다.
 */
const extractErrorCode = (caught: unknown): string | undefined => {
  if (typeof caught !== 'object' || caught === null) return undefined;
  const obj = caught as {
    error?: { code?: string; message?: string };
    code?: string;
  };
  return obj.error?.code ?? obj.code;
};

/** 디버깅용 — Response 로 throw 된 객체에서 status·body 까지 평탄화해 console 에 찍는다. */
const formatErrorForLog = (caught: unknown): Record<string, unknown> => {
  if (typeof caught !== 'object' || caught === null) return { caught };
  const obj = caught as {
    status?: number;
    statusText?: string;
    url?: string;
    error?: unknown;
    data?: unknown;
    code?: string;
    message?: string;
  };
  return {
    status: obj.status,
    statusText: obj.statusText,
    url: obj.url,
    error: obj.error,
    data: obj.data,
    code: obj.code,
    message: caught instanceof Error ? caught.message : obj.message,
    name: caught instanceof Error ? caught.name : undefined,
  };
};

interface UseAccountSettingsFormParams {
  /** 닉네임 자동 저장 성공 시 호출. */
  onNicknameSaved?: () => void;
  /** 닉네임 자동 저장 실패 시 사용자에게 보여줄 메시지를 받는다. */
  onNicknameError?: (message: string) => void;
  /** 프로필 이미지 업로드 성공 시 호출. */
  onProfileImageUploaded?: () => void;
  /** 프로필 이미지 업로드 실패 시 사용자에게 보여줄 메시지를 받는다. */
  onProfileImageError?: (message: string) => void;
}

/**
 * 계정 설정 모달의 폼 상태 + 자동 저장 + 프로필 이미지 업로드를 담당하는 커스텀 훅.
 *
 * - 마운트/`reloadCounter` 변경 시 `privateApi.user.getMe` 로 계정 정보 로드.
 * - 닉네임 1초 debounce 자동 저장(`updateMe({ nickname })`).
 *   - 백엔드 에러 `USER_NICKNAME_DUPLICATED` 는 `onNicknameError` 로 한국어 메시지 위임.
 * - 프로필 이미지 업로드(`uploadProfileImage(file)`):
 *   - 클라이언트 사전 검증 — 5MB 이내, png/jpeg/webp.
 *   - `privateApi.user.updateProfileImage(formData)` 호출. generated 시그니처가
 *     `data: number` 로 추출돼 있어 한 번만 `as unknown as number` 로 우회한다.
 *     (Swagger 의 multipart file 정의가 추가되면 cast 제거.)
 *   - 성공 시 응답 `data: null` 이라 URL 을 못 받아, `getMe` 를 재호출해 화면을 갱신한다.
 *   - 백엔드 에러 `FILE_SIZE_EXCEEDED` / `FILE_INVALID_TYPE` 도 `onProfileImageError` 로 위임.
 * - 이메일은 별도 훅(`useEmailEditForm`)에서 처리. `setInfoEmail` 만 외부에서 동기화 가능하게 노출.
 */
export const useAccountSettingsForm = ({
  onNicknameSaved,
  onNicknameError,
  onProfileImageUploaded,
  onProfileImageError,
}: UseAccountSettingsFormParams = {}) => {
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
        console.error('내 정보 조회에 실패했어요.', caught);
      }
    };
    void fetchMe();
    return () => {
      cancelled = true;
    };
  }, [reloadCounter]);

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
          const code = extractErrorCode(caught);
          if (code === 'USER_NICKNAME_DUPLICATED') {
            onNicknameError?.('이미 사용 중인 닉네임이에요');
          } else {
            onNicknameError?.('닉네임 저장에 실패했어요');
            console.error('닉네임 저장에 실패했어요.', caught);
          }
        }
      };
      void saveNickname();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, canSave, onNicknameSaved, onNicknameError]);

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
        onProfileImageError?.('PNG·JPEG·WEBP 파일만 업로드할 수 있어요');
        return;
      }
      // 2) 크기 사전 검증
      if (file.size > PROFILE_IMAGE_MAX_BYTES) {
        onProfileImageError?.('파일 크기는 5MB 이하여야 해요');
        return;
      }

      const formData = new FormData();
      // 백엔드 multipart part name 은 `profileImage` (Spring `@RequestPart("profileImage")`).
      // 명세에는 `file` 로 적혀 있지만 실제 구현은 `profileImage` 라 후자에 맞춘다.
      formData.append('profileImage', file);

      try {
        // generated 타입이 `data: number` 로 잘못 추출돼 있어 한 번만 우회.
        // Swagger 가 multipart file 정의를 잡아주면 cast 제거 가능.
        await privateApi.user.updateProfileImage(formData as unknown as number);
        setReloadCounter((c) => c + 1);
        onProfileImageUploaded?.();
      } catch (caught) {
        const code = extractErrorCode(caught);
        const status = (caught as { status?: number } | null | undefined)?.status;
        if (code === 'FILE_SIZE_EXCEEDED') {
          onProfileImageError?.('파일 크기가 제한을 초과했어요');
        } else if (code === 'FILE_INVALID_TYPE') {
          onProfileImageError?.('지원하지 않는 파일 형식이에요');
        } else if (status === 500) {
          // 서버 내부 오류는 클라이언트가 더 좁힐 수 없다. 사용자에겐 일반 메시지만 보이고
          // 백엔드 로그 추적은 console.error 의 디버깅 정보로 위임.
          onProfileImageError?.('서버에서 처리하지 못했어요. 잠시 후 다시 시도해 주세요');
          console.error('프로필 이미지 업로드 - 서버 500', formatErrorForLog(caught));
        } else {
          onProfileImageError?.('프로필 이미지 업로드에 실패했어요');
          console.error('프로필 이미지 업로드 실패', formatErrorForLog(caught));
        }
      }
    },
    [onProfileImageUploaded, onProfileImageError],
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
