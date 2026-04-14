'use client';

import { useEffect } from 'react';

export default function DesktopOnlyPage() {
  useEffect(() => {
    document.body.classList.add('desktop-only-page');
    return () => {
      document.body.classList.remove('desktop-only-page');
    };
  }, []);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
      <div className="space-y-2">
        <h1 className="text-foreground text-title-3 font-semibold">데스크탑에서 사용해 주세요</h1>
        <p className="text-muted-foreground text-body-2 max-w-xs">
          이 서비스는 데스크탑 환경에 최적화되어 있습니다. 더 넓은 화면에서 접속해 주세요.
        </p>
      </div>
    </div>
  );
}
