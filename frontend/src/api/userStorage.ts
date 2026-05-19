const isBrowser = typeof window !== 'undefined';

const USER_INFO_KEY = 'user_info';

interface StoredUserInfo {
  nickname: string;
  email: string;
  profileImageUrl?: string;
}

export const userStorage = {
  get: (): StoredUserInfo | null => {
    if (!isBrowser) return null;
    try {
      const raw = localStorage.getItem(USER_INFO_KEY);
      return raw ? (JSON.parse(raw) as StoredUserInfo) : null;
    } catch {
      return null;
    }
  },

  set: (info: StoredUserInfo) => {
    if (!isBrowser) return;
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
  },

  setNickname: (nickname: string) => {
    if (!isBrowser) return;
    const prev = userStorage.get();
    if (!prev) return;
    userStorage.set({ ...prev, nickname });
  },

  clear: () => {
    if (!isBrowser) return;
    localStorage.removeItem(USER_INFO_KEY);
  },
};
