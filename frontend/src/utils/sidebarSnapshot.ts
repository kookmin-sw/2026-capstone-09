// 사이드바 내 하이드레이션 오류를 수정하기 위한 유틸 함수

export const SESSION_KEY = 'node_sidebar_open';

export function subscribeToSession(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function getSessionSnapshot() {
  return sessionStorage.getItem(SESSION_KEY);
}

export function getServerSnapshot() {
  return null; // SSR에서는 항상 null
}
