'use client';

import { Loading } from '@wanteddev/wds';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authStorage } from '@/api/authStorage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = authStorage.getAccess();

    if (token) {
      router.replace('/projects');
    } else {
      router.replace('/auth/login');
    }
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-1 items-center justify-center">
      <Loading />
    </main>
  );
}
