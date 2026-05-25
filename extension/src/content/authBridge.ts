// app.flowmeet.kr에 주입되어 localStorage의 토큰을 extension storage에 동기화
// 프론트엔드 authStorage.ts의 키 이름과 동일하게 맞춤
const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

function syncTokens(): void {
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);

  chrome.runtime.sendMessage({
    type: 'SYNC_TOKENS',
    accessToken: accessToken ?? null,
    refreshToken: refreshToken ?? null,
  });
}

syncTokens();

// 로그인/로그아웃 시 localStorage 변경 감지
window.addEventListener('storage', (e) => {
  if (e.key === ACCESS_KEY || e.key === REFRESH_KEY) {
    syncTokens();
  }
});