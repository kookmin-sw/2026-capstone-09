import { useEffect, useState } from 'react';
import { storage } from '../../utils/storage';
import { LoginView } from './LoginView';
import { MeetingView } from './MeetingView';
import type { UserData } from '../../types';

export function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.get(['accessToken', 'user']).then(({ accessToken, user }) => {
      if (accessToken && user) setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
        로딩 중...
      </div>
    );
  }

  return user ? (
    <MeetingView user={user} onLogout={() => setUser(null)} />
  ) : (
    <LoginView onLogin={setUser} />
  );
}