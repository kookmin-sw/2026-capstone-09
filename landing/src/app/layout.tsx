import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'flowMeet — 기획이 흐름을 만나는 순간',
  description:
    '아이디어의 분기를 노드 플로우로 시각화하고, 회의·요약·AI 에이전트를 하나의 흐름에 담는 협업 툴.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        {children}
      </body>
    </html>
  );
}
