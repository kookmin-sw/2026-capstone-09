import { authStorage } from './authStorage';

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
    const response = await fetch(input, init);

    if (response.status === 401) {
      const refreshToken = authStorage.getRefresh();
      if (!refreshToken) {
        handleLogout();
        return response;
      }

      try {
        // 추후 리프레시 토큰 요청 코드로 변경
        const res = await fetch('/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) {
          handleLogout();
          return response;
        }

        const { accessToken, refreshToken: newRefresh } = await res.json();
        authStorage.setTokens(accessToken, newRefresh);

        // 새 토큰을 헤더에 직접 넣어서 재시도
        return fetch(input, {
          ...init,
          headers: {
            ...init?.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch {
        handleLogout();
        return response;
      }
    }

    return response;
  };

  return customFetch(authFetch);
}

function handleLogout() {
  authStorage.clear();
  window.location.href = '/login';
}
