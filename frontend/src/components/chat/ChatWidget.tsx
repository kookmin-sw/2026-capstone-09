'use client';

import { useState, useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
import { FloatingChatButton } from './FloatingChatButton';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNodeSidebarOpen, setIsNodeSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return window.innerWidth * 0.4;
  });

  // NodeSidebar 너비 계산
  useEffect(() => {
    const updateSidebarWidth = () => {
      const width = window.innerWidth * 0.4;
      setSidebarWidth(width);
    };

    window.addEventListener('resize', updateSidebarWidth);
    return () => window.removeEventListener('resize', updateSidebarWidth);
  }, []);

  // NodeSidebar 상태 구독 (항상 살아있는 컴포넌트에서)
  useEffect(() => {
    const handleSidebarState = (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen: boolean }>;
      const isOpen = customEvent.detail?.isOpen ?? false;
      setIsNodeSidebarOpen(isOpen);
    };

    window.addEventListener('sidebar-state-change', handleSidebarState);

    return () => {
      window.removeEventListener('sidebar-state-change', handleSidebarState);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <ChatWindow
          onClose={() => setIsOpen(false)}
          isNodeSidebarOpen={isNodeSidebarOpen}
          sidebarWidth={sidebarWidth}
        />
      )}
      {!isOpen && (
        <FloatingChatButton
          onClick={() => setIsOpen(true)}
          isNodeSidebarOpen={isNodeSidebarOpen}
          sidebarWidth={sidebarWidth}
        />
      )}
    </>
  );
}
