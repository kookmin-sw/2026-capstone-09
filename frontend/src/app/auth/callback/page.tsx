'use client';

import { Loading } from '@wanteddev/wds';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { authStorage } from '@/api/authStorage';
import { toastStore } from '@/components/commons/custom-toast/toastStore';
import { verifyOAuthState } from '@/lib/oauth';
import { useLoginGoogleMutation } from '@/queries/auth';

let toastCount = 0;
function showToast(content: string, variant: 'positive' | 'negative' = 'negative') {
  toastStore.add({
    id: `auth-callback-${++toastCount}`,
    content,
    variant,
    placement: 'top-center',
  });
}

export default function AuthCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const hasProcessed = useRef(false);
  const loginMutation = useLoginGoogleMutation();

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const code = params.get('code');
    const state = params.get('state');

    if (!code) {
      router.replace('/auth/login');
      return;
    }

    if (!verifyOAuthState(state)) {
      router.replace('/auth/login');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback`;

    loginMutation.mutate(
      { code, redirectUri },
      {
        onSuccess: (data) => {
          if (data.code === 'LOGIN') {
            // 가입된 유저
            if (data.data?.accessToken && data.data?.refreshToken) {
              authStorage.setTokens(data.data.accessToken, data.data.refreshToken);
              router.replace('/projects');
            } else {
              showToast(data.message);
              router.replace('/auth/login');
            }
          } else if (data.code === 'SIGNUP_REQUIRED') {
            // 미가입된 유저
            sessionStorage.setItem('signup_pending', JSON.stringify(data.data));
            router.replace('/auth/signup');
          } else {
            showToast(data.message);
            router.replace('/auth/login');
          }
        },
        onError: (error) => {
          showToast(error.message);
          router.replace('/auth/login');
        },
      },
    );
  }, [params, router, loginMutation]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading />
    </div>
  );
}