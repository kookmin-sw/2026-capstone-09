"use client";

import { Bell, FolderOpen, Users } from "lucide-react";
import { useModal } from "@/components/commons/modal/ModalContext";
import { Button } from "@wanteddev/wds";

// ── 사이드바 예시 컴포넌트 ──────────────────────────────────
function SettingsSidebar() {
  const items = [
    { icon: <FolderOpen size={16} />, label: "프로젝트" },
    { icon: <Users size={16} />, label: "구성원" },
    { icon: <Bell size={16} />, label: "알림" },
  ];

  return (
    <nav className="mt-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
        설정
      </p>
      <ul className="space-y-0.5">
        {items.map(({ icon, label }) => (
          <li key={label}>
            <button
              className="
                flex items-center gap-2.5 w-full px-3 py-2 rounded-lg
                text-sm text-gray-600 font-medium
                hover:bg-white hover:text-gray-900 hover:shadow-sm
                transition-all duration-150
              "
            >
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
        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          <FolderOpen size={28} className="text-gray-400" />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
            이름
          </label>
          <div className="relative">
            <input
              defaultValue="황수민의 비밀 공간❤️"
              maxLength={50}
              className="
                w-full border border-gray-200 rounded-lg
                px-3 py-2 text-sm text-gray-800
                focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400
                transition-all duration-150
              "
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              6/50
            </span>
          </div>
        </div>
      </div>

      {/* 메타 정보 */}
      <div className="space-y-1 text-sm text-gray-500">
        <p>구성원 수: <span className="text-gray-800 font-medium">10명</span></p>
        <p>프로젝트 생성일: <span className="text-gray-800 font-medium">2025.12.18.</span></p>
      </div>

      {/* 위험 영역 */}
      <div className="pt-6 border-t border-gray-100">
        <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
          <span>🗑</span>
          프로젝트 삭제
        </button>
      </div>
    </div>
  );
}

// ── Demo Page ─────────────────────────────────────────────
export default function DemoPage() {
  const { openModal, closeModal } = useModal()!;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Global Modal Demo</h1>
      <p className="text-sm text-gray-500 mb-4 text-center">
        세 가지 모달 변형 · 전역 어디서든 <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">useModal()</code> 으로 열기
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">

        {/* ① default 모달 */}
        <Button
          onClick={() =>
            openModal({
              variant: "default",
              title: "기본 모달",
              content: (
                <p className="text-gray-600 text-sm leading-relaxed">
                  상하좌우 패딩이 모두 <strong>48px</strong>인 기본 모달입니다.
                  본문에는 어떤 콘텐츠든 자유롭게 채울 수 있습니다.
                </p>
              ),
            })
          }
          className="px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Default 모달 열기
        </Button>

        {/* ② compact 모달 */}
        <button
          onClick={() =>
            openModal({
              variant: "compact",
              title: "컴팩트 모달",
              content: (
                <p className="text-gray-600 text-sm leading-relaxed">
                  좌우 <strong>36px</strong>, 상하 <strong>24px</strong> 패딩의 컴팩트 모달입니다.
                  알림, 확인 다이얼로그 등 짧은 콘텐츠에 적합합니다.
                </p>
              ),
            })
          }
          className="px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-500 transition-colors"
        >
          Compact 모달 열기
        </button>

        {/* ③ sidebar 모달 */}
        <button
          onClick={() =>
            openModal({
              variant: "sidebar",
              title: "프로젝트 설정",
              sidebar: <SettingsSidebar />,
              content: <ProjectSettingsContent onClose={closeModal} />,
            })
          }
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Sidebar 모달 열기
        </button>
      </div>

      {/* 사용법 코드 힌트 */}
      <pre className="mt-8 bg-gray-900 text-gray-300 text-xs rounded-xl px-6 py-5 w-full max-w-xl leading-relaxed">
{`// 어느 컴포넌트에서든
const { openModal } = useModal();

openModal({
  variant: "sidebar",   // "default" | "compact" | "sidebar"
  size: "lg",           // "sm" | "md" | "lg" | "xl" | "full"
  title: "프로젝트 설정",
  sidebar: <MySidebar />,
  content: <MyContent />,
});`}
      </pre>
    </main>
  );
}