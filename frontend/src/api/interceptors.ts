import { authStorage } from './authStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T = unknown> {
  status: number;
  code: string;
  message: string;
  data: T | null;
}

let refreshing: Promise<string> | null = null;

export function customFetch(baseFetch: typeof fetch = fetch) {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await baseFetch(input, init);
    const json = await response.json();

    return new Response(JSON.stringify(json), {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
}

export function createAuthFetch() {
  const authFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // access token 헤더에 추가
    const accessToken = authStorage.getAccess();
    const headers = new Headers(init?.headers);
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(input, {
      ...init,
      headers,
    });

    // 401 에러 처리
    if (response.status === 401) {
      const clonedResponse = response.clone();
      let errorData: ApiResponse | null = null;

      try {
        errorData = await clonedResponse.json();
      } catch {
        handleLogout();
        return response;
      }

      const errorCode = errorData?.code;

      // refreshToken 문제 → 강제 로그아웃
      if (errorCode === 'AUTH_EXPIRED_TOKEN' || errorCode === 'AUTH_INVALID_TOKEN') {
        handleLogout();
        return response;
      }

      // access token 만료 → refresh 시도
      if (errorCode === 'EXPIRED_ACCESS_TOKEN' || errorCode === 'INVALID_ACCESS_TOKEN') {
        const refreshToken = authStorage.getRefresh();
        if (!refreshToken) {
          handleLogout();
          return response;
        }

        try {
          if (!refreshing) {
            refreshing = doRefresh(refreshToken);
          }
          const newAccessToken = await refreshing;

          // 새 access token으로 요청 재시도
          const retryHeaders = new Headers(init?.headers);
          retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);

          return fetch(input, {
            ...init,
            headers: retryHeaders,
          });
        } catch {
          handleLogout();
          return response;
        } finally {
          refreshing = null;
        }
      }

      return response;
    }

    return response;
  };

  return customFetch(authFetch);
}

async function doRefresh(refreshToken: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error('Token refresh failed');
  }

  const json: ApiResponse<{ accessToken: string; refreshToken: string }> = await res.json();

  if (!json.data?.accessToken || !json.data?.refreshToken) {
    throw new Error('Invalid refresh response');
  }

  authStorage.setTokens(json.data.accessToken, json.data.refreshToken);

  return json.data.accessToken;
}

function handleLogout() {
  authStorage.clear();
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}
