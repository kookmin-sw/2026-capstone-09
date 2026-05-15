'use client';

import { useMutation } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginGoogleRequest {
  code: string;
  redirectUri: string;
}

interface SignupRequest {
  socialProvider: string;
  socialAccessToken: string;
  nickname: string;
  email: string;
}

interface AuthResponse {
  status: number;
  code: string;
  message: string;
  data: {
    accessToken?: string;
    refreshToken?: string;
    socialProvider?: string;
    socialAccessToken?: string;
    name?: string;
    email?: string;
  } | null;
}

interface RefreshRequest {
  refreshToken: string;
}

// Google 로그인
export function useLoginGoogleMutation() {
  return useMutation({
    mutationFn: async (request: LoginGoogleRequest): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/v1/auth/login/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || '로그인에 실패했어요.');
      }

      return res.json();
    },
  });
}

// 회원가입
export function useSignupMutation() {
  return useMutation({
    mutationFn: async (request: SignupRequest): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || '회원가입에 실패했어요.');
      }

      return res.json();
    },
  });
}

// 토큰 갱신
export function useRefreshMutation() {
  return useMutation({
    mutationFn: async (request: RefreshRequest): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || '토큰 갱신에 실패했어요.');
      }

      return res.json();
    },
  });
}

// 회원가입 이메일 인증 코드 발송
export function useSendEmailVerificationMutation() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/v1/auth/signup/email-verifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || '인증 코드 발송에 실패했어요.');
      }

      return res.json();
    },
  });
}

// 회원가입 이메일 인증 코드 검증
export function useVerifyEmailCodeMutation() {
  return useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/v1/auth/signup/email-verifications/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || '인증 코드 검증에 실패했어요.');
      }

      return res.json();
    },
  });
}