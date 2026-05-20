'use client';

import Image from 'next/image';

interface FloatingChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export function FloatingChatButton({ onClick, hasUnread = false }: FloatingChatButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50"
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