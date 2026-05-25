'use client';

import { useCallback, useState } from 'react';

export type LinkEditMode = 'add' | 'edit';

interface UseLinkEditFormParams {
  /** 'add'면 새로 만들 때, 'edit'면 기존 항목 수정. */
  mode: LinkEditMode;
  /** 'edit' 모드에서 비교 기준이 되는 기존 URL. add 모드에선 빈 문자열로 둔다. */
  initialUrl?: string;
  /** 'edit' 모드에서 비교 기준이 되는 기존 사용자 지정 라벨. add 모드에선 빈 문자열로 둔다. */
  initialName?: string;
}

/**
 * 링크 추가/수정 다이얼로그가 부모(`onSave`)로 넘기는 페이로드.
 *
 * - `url`  : 백엔드 `ProjectUrlRequest.url`로 보낼 정규화된 URL.
 * - `name` : 백엔드 `ProjectUrlRequest.name`으로 보낼 사용자 라벨.
 */
export interface LinkEditPayload {
  url: string;
  name: string;
}

/**
 * URL 형식 자체에 대한 가벼운 정규화·검증.
 * - http/https 스킴이 빠진 입력은 자동으로 https:// 를 붙여 본다.
 * - URL 생성에 실패하면 invalid 처리.
 */
const normalizeUrl = (raw: string): string => {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const isValidUrl = (raw: string): boolean => {
  const candidate = normalizeUrl(raw);
  if (candidate.length === 0) return false;
  try {
    new URL(candidate);
    return true;
  } catch {
    return false;
  }
};

/**
 * 링크 추가/수정 다이얼로그의 폼 상태·검증·페이로드 생성을 담당하는 커스텀 훅.
 *
 * - `name` / `url` : TextField와 양방향 바인딩하는 두 입력 상태.
 * - `isUrlInvalid` : 사용자가 무엇인가 입력했지만 URL 형식이 아닌 상태 (TextField invalid 표시용).
 * - `canSave`      : 저장 버튼 활성 여부.
 *                    add: URL 유효
 *                    edit: URL 유효 + (URL 또는 이름이 변경됨)
 * - `buildPayload` : 부모로 넘길 `{ url, name }` 객체 생성. URL은 정규화 적용.
 *
 * 백엔드 `ProjectUrlRequest`가 `{ name, url }` 두 필드 모두 받으므로 payload를
 * 그대로 호출부에서 API 바디로 전달하면 된다.
 */
export const useLinkEditForm = ({
  mode,
  initialUrl = '',
  initialName = '',
}: UseLinkEditFormParams) => {
  const [url, setUrl] = useState(initialUrl);
  const [name, setName] = useState(initialName);

  const trimmedUrl = url.trim();
  const trimmedName = name.trim();
  const validUrl = isValidUrl(trimmedUrl);
  const isUrlInvalid = trimmedUrl.length > 0 && !validUrl;

  const isChanged =
    mode === 'edit'
      ? trimmedUrl !== initialUrl.trim() || trimmedName !== initialName.trim()
      : true;
  const canSave = validUrl && isChanged;

  const buildPayload = useCallback(
    (): LinkEditPayload => ({
      url: normalizeUrl(trimmedUrl),
      name: trimmedName,
    }),
    [trimmedUrl, trimmedName],
  );

  const reset = useCallback(() => {
    setUrl('');
    setName('');
  }, []);

  return {
    url,
    setUrl,
    name,
    setName,
    isUrlInvalid,
    canSave,
    buildPayload,
    reset,
  };
};
