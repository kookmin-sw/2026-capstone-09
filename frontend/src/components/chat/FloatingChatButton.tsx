'use client';

import Image from 'next/image';

interface FloatingChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
  isNodeSidebarOpen: boolean;
  sidebarWidth: number;
}

export function FloatingChatButton({
  onClick,
  hasUnread = false,
  isNodeSidebarOpen,
  sidebarWidth,
}: FloatingChatButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const rightPosition = isNodeSidebarOpen ? 24 + sidebarWidth : 24;

  return (
    <button
      onClick={handleClick}
      className="bg-primary fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg hover:shadow-xl"
      style={{
        right: rightPosition,
        transition: 'right 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
      aria-label="AI 챗봇 열기"
    >
      {hasUnread && (
        <span className="bg-status-negative border-static-white absolute top-0 right-0 h-3 w-3 rounded-full border-2" />
      )}
      <Image
        src="/images/chatbot-agent.svg"
        alt="FlowMeet chatbot icon"
        width={64}
        height={64}
        priority
      />
    </button>
  );
}
