// 사이드바 내 하이드레이션 오류를 수정하기 위한 유틸 함수

export const SESSION_KEY = 'node_sidebar_open';
const SIDEBAR_CHANGE_EVENT = 'sidebar-state-change';

export function subscribeToSession(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(SIDEBAR_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, callback);
  };
}

export function getSessionSnapshot() {
  return sessionStorage.getItem(SESSION_KEY);
}

export function getServerSnapshot() {
  return null; // SSR에서는 항상 null
}

export function setSidebarState(isOpen: boolean) {
  if (isOpen) {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT));
}
