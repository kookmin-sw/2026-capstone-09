// // 토큰 확인 로직(로컬스토리지)

// const ACCESS_KEY = 'access_token';
// const REFRESH_KEY = 'refresh_token';

// // 브라우저 환경인지 확인하는 유틸리티 -> 서버 사이드 환경 대응
const isBrowser = typeof window !== 'undefined';

// export const authStorage = {
//   getAccess: () => {
//     if (!isBrowser) return null;
//     return localStorage.getItem(ACCESS_KEY);
//   },

//   getRefresh: () => {
//     if (!isBrowser) return null;
//     return localStorage.getItem(REFRESH_KEY);
//   },

//   setTokens: (access: string, refresh: string) => {
//     if (!isBrowser) return;
//     localStorage.setItem(ACCESS_KEY, access);
//     localStorage.setItem(REFRESH_KEY, refresh);
//   },

//   clear: () => {
//     if (!isBrowser) return;
//     localStorage.removeItem(ACCESS_KEY);
//     localStorage.removeItem(REFRESH_KEY);
//   },
// };

// 현재 서버 사이드 환경이 많아서 임시로 사용합니다. CSR로 전환할 시 위 코드를 사용하면 됩니다.
import Cookies from 'js-cookie';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

// 쿠키 설정 (보안 및 경로 설정)
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7, // 7일 동안 유지
  path: '/',
  secure: process.env.NODE_ENV === 'production', // 배포 환경에서만 HTTPS 적용
  sameSite: 'lax',
};

export const authStorage = {
  getAccess: () =>
    Cookies.get(ACCESS_KEY) ||
    (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null),

  setTokens: (access: string, refresh: string) => {
    // 1. 로컬스토리지 저장
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);

    // 2. 쿠키 저장 (핵심!)
    Cookies.set(ACCESS_KEY, access, COOKIE_OPTIONS);
    Cookies.set(REFRESH_KEY, refresh, COOKIE_OPTIONS);
  },

  getRefresh: () => {
    if (!isBrowser) return null;
    return localStorage.getItem(REFRESH_KEY);
  },

  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    Cookies.remove(ACCESS_KEY, { path: '/' });
    Cookies.remove(REFRESH_KEY, { path: '/' });
  },
};
