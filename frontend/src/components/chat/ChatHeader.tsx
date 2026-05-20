'use client';

import { IconButton } from '@wanteddev/wds';
import { IconTemplate } from '@wanteddev/wds-icon';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export function ChatHeader({ isSidebarOpen, onOpenSidebar }: ChatHeaderProps) {
  return (
    <div className={`px-5 py-4 flex justify-between items-center ${isSidebarOpen ? 'rounded-tr-xl' : 'rounded-t-xl'}`}>
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
          <p className="text-caption-2 font-regular text-interaction-inactive">새 대화를 시작하세요</p>
        </div>
      </div>
    </div>
  );
}