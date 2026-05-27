'use client';

import Image from 'next/image';

interface FloatingChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
  isNodeSidebarOpen: boolean;
  sidebarWidth: number;
}

export function FloatingChatButton({ onClick, hasUnread = false, isNodeSidebarOpen, sidebarWidth }: FloatingChatButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const rightPosition = isNodeSidebarOpen ? 24 + sidebarWidth : 24;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50"
      style={{
        right: rightPosition,
        transition: isNodeSidebarOpen
          ? 'right 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
          : 'none',
      }}
      aria-label="AI 챗봇 열기"
    >
      {hasUnread && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-status-negative rounded-full border-2 border-static-white" />
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