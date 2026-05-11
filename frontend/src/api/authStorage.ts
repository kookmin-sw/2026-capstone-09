const isBrowser = typeof window !== 'undefined';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const authStorage = {
  getAccess: () => {
    if (!isBrowser) return null;
    return localStorage.getItem(ACCESS_KEY);
  },

  getRefresh: () => {
    if (!isBrowser) return null;
    return localStorage.getItem(REFRESH_KEY);
  },

  setTokens: (access: string, refresh: string) => {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },

  clear: () => {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
