'use client';

import { IconChat } from '@wanteddev/wds-icon';
import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  shouldAnimate?: boolean;
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col">
      {messages.length === 0 && !isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-60 inline-flex flex-col justify-start items-center gap-3">
            <div className="h-12 relative flex flex-col justify-center items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <IconChat width={44} height={44} className="text-label-assistive" />
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-center items-center gap-1">
              <div className="text-label-alternative text-body-1 font-medium">
                새 채팅을 시작해 보세요
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              shouldAnimate={message.shouldAnimate}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-fill-alternative px-4 py-2 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-label-alternative rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-label-alternative rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-label-alternative rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}