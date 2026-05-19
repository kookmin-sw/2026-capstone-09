'use client';

import { Loading } from '@wanteddev/wds';
import { useEffect } from 'react';
import { startGoogleLogin } from '@/lib/oauth';

export default function GoogleAuthPage() {
  useEffect(() => {
    try {
      startGoogleLogin();
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google 로그인 설정에 문제가 있습니다. 관리자에게 문의해 주세요.');
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading />
    </div>
  );
}