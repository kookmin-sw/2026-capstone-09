'use client';

import { IconButton } from '@wanteddev/wds';
import { IconClose, IconTemplate } from '@wanteddev/wds-icon';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  onClose: () => void;
}

export function ChatHeader({ isSidebarOpen, onOpenSidebar, onClose }: ChatHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 ${isSidebarOpen ? 'rounded-tr-xl' : 'rounded-t-xl'}`}
    >
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <IconButton
            onClick={onOpenSidebar}
            variant="background"
            aria-label="채팅 목록 열기"
            sx={{ width: '28px', height: '28px', padding: 0 }}
          >
            <IconTemplate width={20} height={20} />
          </IconButton>
        )}
        <div className="flex flex-col">
          <p className="text-caption-1 font-medium">플로밋 AI 에이전트</p>
          <p className="text-caption-2 font-regular text-interaction-inactive">
            새 대화를 시작하세요
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="채팅 닫기"
        className="text-label-alternative hover:text-label-neutral flex h-7 w-7 items-center justify-center border-none bg-transparent p-0"
      >
        <IconClose className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
