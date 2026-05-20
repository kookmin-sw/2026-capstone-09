import { API_BASE_URL } from '../utils/constants';
import { storage } from '../utils/storage';
import type { ApiResponse } from '../types';

let refreshingPromise: Promise<string> | null = null;

async function refreshTokens(): Promise<string> {
  const { refreshToken } = await storage.get(['refreshToken']);
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const json: ApiResponse<{ accessToken: string; refreshToken: string }> = await res.json();
  if (!json.data?.accessToken || !json.data?.refreshToken) {
    throw new Error('Token refresh failed');
  }

  await storage.set({
    accessToken: json.data.accessToken,
    refreshToken: json.data.refreshToken,
  });

  return json.data.accessToken;
}

async function getValidAccessToken(): Promise<string> {
  const { accessToken } = await storage.get(['accessToken']);
  if (!accessToken) throw new Error('Not authenticated');
  return accessToken;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const makeRequest = async (token: string): Promise<Response> =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  let token = await getValidAccessToken();
  let res = await makeRequest(token);

  if (res.status === 401) {
    // 중복 refresh 방지
    if (!refreshingPromise) {
      refreshingPromise = refreshTokens().finally(() => {
        refreshingPromise = null;
      });
    }
    token = await refreshingPromise;
    res = await makeRequest(token);
  }

  return parseJsonResponse<T>(res);
}

async function parseJsonResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new Error(`API 응답 파싱 실패 (status: ${res.status}): ${text.slice(0, 100)}`);
  }
}