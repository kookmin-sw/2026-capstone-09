'use client';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';

/**
 * 사용자가 업로드한 이미지 파일을 미리보기로 띄우고,
 * 언마운트/재선택 시 이전 Object URL을 해제하는 공통 훅.
 *
 * Account/Project 설정 등 프로필 이미지를 고르는 화면에서 반복되는 로직을 묶었다.
 */
export const useProfileImagePreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreviewUrl(url);
    // 동일 파일 재선택도 허용
    event.target.value = '';
  };

  return { previewUrl, handleImageChange };
};
