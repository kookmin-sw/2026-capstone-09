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
      return res.json();
    },
  });
}

// 이메일 인증 코드 발송
export function useSendEmailVerificationMutation() {
  return useMutation({
    mutationFn: async ({ email, accessToken }: { email: string; accessToken?: string }): Promise<AuthResponse> => {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/v1/users/me/email-verifications`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email }),
      });
      return res.json();
    },
  });
}

// 이메일 인증 코드 검증
export function useVerifyEmailCodeMutation() {
  return useMutation({
    mutationFn: async ({ email, code, accessToken }: { email: string; code: string; accessToken?: string }): Promise<AuthResponse> => {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/v1/users/me/email-verifications/verify`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, code }),
      });
      return res.json();
    },
  });
}