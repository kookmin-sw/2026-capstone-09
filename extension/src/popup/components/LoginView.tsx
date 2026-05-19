import { useState } from 'react';
import { apiFetch } from '../../api/client';
import { storage } from '../../utils/storage';
import type { UserData } from '../../types';

interface Props {
  onLogin: (user: UserData) => void;
}

const FLOWMEET_URL = 'https://app.flowmeet.kr';

export function LoginView({ onLogin }: Props) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openWebApp = () => {
    chrome.tabs.create({ url: FLOWMEET_URL });
  };

  const checkLogin = async () => {
    setChecking(true);
    setError(null);
    try {
      const { accessToken } = await chrome.storage.local.get(['accessToken']);
      if (!accessToken) {
        setError('아직 로그인이 감지되지 않았습니다. 웹앱에서 로그인 후 다시 눌러주세요.');
        return;
      }

      // 토큰이 있으면 사용자 정보 조회
      const res = await apiFetch<{ email?: string; nickname?: string }>('/v1/users/me');
      if (!res.data?.email) {
        setError('사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.');
        return;
      }

      const user: UserData = {
        email: res.data.email,
        nickname: res.data.nickname ?? res.data.email.split('@')[0],
      };
      await storage.set({ user });
      onLogin(user);
    } catch {
      setError('확인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#4f46e5', letterSpacing: '-0.5px' }}>
          FlowMeet
        </div>
        <div style={{ color: '#6b7280', fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
          익스텐션을 사용하려면
          <br />
          FlowMeet 웹앱에 먼저 로그인해주세요
        </div>
      </div>

      <div
        style={{
          background: '#f5f3ff',
          border: '1px solid #e0d9ff',
          borderRadius: 8,
          padding: '12px 14px',
          marginBottom: 16,
          fontSize: 13,
          color: '#4f46e5',
          lineHeight: 1.7,
        }}
      >
        <strong>① </strong> 아래 버튼으로 웹앱 열기
        <br />
        <strong>② </strong> FlowMeet에 로그인
        <br />
        <strong>③ </strong> 이 팝업으로 돌아와서 &ldquo;로그인 확인&rdquo; 클릭
      </div>

      <button
        onClick={openWebApp}
        style={{
          width: '100%',
          padding: '10px 16px',
          border: 'none',
          borderRadius: 8,
          background: '#4f46e5',
          color: '#fff',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: 8,
        }}
      >
        FlowMeet 웹앱 열기 →
      </button>

      <button
        onClick={checkLogin}
        disabled={checking}
        style={{
          width: '100%',
          padding: '10px 16px',
          border: '1px solid #d1d5db',
          borderRadius: 8,
          background: checking ? '#f9fafb' : '#fff',
          color: '#374151',
          fontSize: 14,
          fontWeight: 500,
          cursor: checking ? 'not-allowed' : 'pointer',
        }}
      >
        {checking ? '확인 중...' : '로그인 확인'}
      </button>

      {error && (
        <div
          style={{
            marginTop: 10,
            padding: '8px 12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 6,
            color: '#dc2626',
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
