'use client';

import { Button } from '@wanteddev/wds';
import { IconFolder, IconBell, IconPerson } from '@wanteddev/wds-icon';
import { useModal } from '@/components/commons/modal/ModalContext';

// ── 사이드바 예시 컴포넌트 ──────────────────────────────────
function SettingsSidebar() {
  const items = [
    { icon: <IconFolder />, label: '프로젝트' },
    { icon: <IconPerson />, label: '구성원' },
    { icon: <IconBell />, label: '알림' },
  ];

  return (
    <nav className="mt-1">
      <p className="mb-3 px-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
        설정
      </p>
      <ul className="space-y-0.5">
        {items.map(({ icon, label }) => (
          <li key={label}>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-white hover:text-gray-900 hover:shadow-sm">
              <span className="text-gray-400">{icon}</span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ── 프로젝트 설정 본문 예시 ────────────────────────────────
function ProjectSettingsContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      {/* 아이콘 + 이름 */}
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <IconFolder />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
            이름
          </label>
          <div className="relative">
            <input
              defaultValue="황수민의 비밀 공간❤️"
              maxLength={50}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 transition-all duration-150 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 focus:outline-none"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">
              6/50
            </span>
          </div>
        </div>
      </div>

      {/* 메타 정보 */}
      <div className="space-y-1 text-sm text-gray-500">
        <p>
          구성원 수: <span className="font-medium text-gray-800">10명</span>
        </p>
        <p>
          프로젝트 생성일: <span className="font-medium text-gray-800">2025.12.18.</span>
        </p>
      </div>

      {/* 위험 영역 */}
      <div className="border-t border-gray-100 pt-6">
        <button
          className="flex items-center gap-2 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
          onClick={onClose}
        >
          <span>🗑</span>
          프로젝트 삭제 죄송해요 귀찮앗는데 여기 누르면 모달 닫힙니다
        </button>
      </div>
    </div>
  );
}

// ── Demo Page ─────────────────────────────────────────────
export default function DemoPage() {
  const { openModal, closeModal } = useModal()!;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-800">Global Modal Demo</h1>
      <p className="mb-4 text-center text-sm text-gray-500">
        세 가지 모달 변형 · 전역 어디서든{' '}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">useModal()</code> 으로 열기
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* ① default 모달 */}
        <Button
          onClick={() =>
            openModal({
              variant: 'default',
              content: (
                <p className="text-sm leading-relaxed text-gray-600">
                  상하좌우 패딩이 모두 <strong>48px</strong>인 기본 모달입니다. 본문에는 어떤
                  콘텐츠든 자유롭게 채울 수 있습니다.
                </p>
              ),
            })
          }
          className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          Default 모달 열기
        </Button>

        {/* ② compact 모달 */}
        <button
          onClick={() =>
            openModal({
              variant: 'compact',
              content: (
                <p className="text-sm leading-relaxed text-gray-600">
                  좌우 <strong>36px</strong>, 상하 <strong>24px</strong> 패딩의 컴팩트 모달입니다.
                  검색 모달에 적합합니다.
                </p>
              ),
            })
          }
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-500"
        >
          Compact 모달 열기
        </button>

        {/* ③ sidebar 모달 */}
        <button
          onClick={() =>
            openModal({
              variant: 'sidebar',
              sidebar: <SettingsSidebar />,
              content: <ProjectSettingsContent onClose={closeModal} />,
            })
          }
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Sidebar 모달 열기
        </button>
      </div>

      {/* 사용법 코드 힌트 */}
      <pre className="mt-8 w-full max-w-xl rounded-xl bg-gray-900 px-6 py-5 text-xs leading-relaxed text-gray-300">
        {`// 어느 컴포넌트에서든
const { openModal } = useModal();

openModal({
  variant: "sidebar",   // "default" | "compact" | "sidebar"
  sidebar: <MySidebar />,
  content: <MyContent />,
});`}
      </pre>
    </main>
  );
}
