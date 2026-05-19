//Google OAuth 2.0 URL 생성 및 관련 유틸리티

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export interface OAuthConfig {
  redirectUri: string;
  state?: string;
}

// Google OAuth 2.0 인증 URL 생성
export function buildGoogleOAuthUrl(config: OAuthConfig): string {
  const { redirectUri, state = crypto.randomUUID() } = config;

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile https://www.googleapis.com/auth/calendar.events',
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// Google 로그인 시작 (브라우저 환경)
export function startGoogleLogin(redirectUri?: string): void {
  if (typeof window === 'undefined') {
    throw new Error('startGoogleLogin은 브라우저 환경에서만 사용 가능합니다.');
  }

  if (!GOOGLE_CLIENT_ID) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
  }

  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth_state', state);

  const uri = redirectUri || `${window.location.origin}/auth/callback`;
  window.location.href = buildGoogleOAuthUrl({ redirectUri: uri, state });
}

// OAuth state 검증
export function verifyOAuthState(receivedState: string | null): boolean {
  if (typeof window === 'undefined') return false;

  const savedState = sessionStorage.getItem('oauth_state');
  sessionStorage.removeItem('oauth_state');

  return savedState !== null && savedState === receivedState;
}