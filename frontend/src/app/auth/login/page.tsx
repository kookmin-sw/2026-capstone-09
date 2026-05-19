'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function LoginPage() {
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (hasShownToast.current) return;

    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error && !hasShownToast.current) {
      hasShownToast.current = true;
      window.history.replaceState({}, '', '/auth/login');
    }
  }, []);

  return (
    <main className="flex min-h-screen">
      {/* 왼쪽 1/3 */}
      <div className="w-1/3">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-screen object-cover"
        >
          <source src="/videos/login.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex w-2/3 items-start justify-center pt-[35vh]">
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-start justify-start overflow-hidden">
            <h1 className="text-title-1 font-bold">로그인</h1>
          </div>

          <div className="flex flex-col gap-6 w-84">
            <Link
              href="/auth/google"
              prefetch={false}
              className="relative flex items-center justify-center rounded-xl border border-line-normal-neutral bg-static-white px-6 h-14 text-body-1 font-medium text-label-normal transition-colors hover:bg-fill-alternative"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="absolute left-6">
                <path
                  d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
                  fill="#4285F4"
                />
                <path
                  d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
                  fill="#34A853"
                />
                <path
                  d="M4.405 11.9c-.2-.6-.314-1.241-.314-1.9 0-.659.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
                  fill="#FBBC05"
                />
                <path
                  d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.737 7.395 3.977 10 3.977z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google로 시작하기</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}