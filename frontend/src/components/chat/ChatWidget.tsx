'use client';

import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { FloatingChatButton } from './FloatingChatButton';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      {!isOpen && <FloatingChatButton onClick={() => setIsOpen(true)} />}
    </>
  );
}