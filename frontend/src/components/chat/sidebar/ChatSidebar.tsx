'use client';

import { List, ListCell, ScrollArea } from '@wanteddev/wds';
import { IconTemplate, IconChat, IconSearch } from '@wanteddev/wds-icon';
import { useModal } from '@/components/commons/modal/ModalContext';
import { ChatListItem } from './ChatListItem';
import { ChatSearchModalContent } from '../search/ChatSearchModalContent';

interface ChatSession {
  chatSessionId?: number | null;
  title?: string | null;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  chatSessions: ChatSession[];
  projectId: number;
  selectedChatId: number | null;
  hoveredChatId: number | null;
  menuOpenChatId: number | null;
  currentChatSessionId: number | null;
  onSelectChat: (chatId: number | null) => void;
  onHoverChange: (chatId: number | null) => void;
  onMenuOpenChange: (chatId: number | null) => void;
  onCurrentChatClear: () => void;
}

export function ChatSidebar({
  isOpen,
  onClose,
  onNewChat,
  chatSessions,
  projectId,
  selectedChatId,
  hoveredChatId,
  menuOpenChatId,
  currentChatSessionId,
  onSelectChat,
  onHoverChange,
  onMenuOpenChange,
  onCurrentChatClear,
}: ChatSidebarProps) {
  const { openModal, closeModal } = useModal();

  const handleSearchClick = () => {
    openModal({
      variant: 'compact',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ChatSearchModalContent
          projectId={projectId}
          onResultClick={(item) => {
            onSelectChat(item.chatSessionId);
            closeModal();
          }}
        />
      ),
    });
  };

  return (
    <div
      className={`absolute right-full top-0 w-44 h-full px-4 bg-white rounded-l-xl border-r border-line-normal-normal flex flex-col gap-1 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="py-5 flex justify-end items-center">
        <button
          onClick={onClose}
          className="w-7 h-7 bg-transparent border-0 p-0 flex items-center justify-center"
          aria-label="사이드바 닫기"
        >
          <IconTemplate width={20} height={20} className="text-label-alternative" />
        </button>
      </div>

      <List>
        <ListCell
          onClick={onNewChat}
          leadingContent={<IconChat width={16} height={16} />}
          verticalPadding="small"
          sx={{ cursor: 'pointer', alignItems: 'center' }}
        >
          <span className="text-caption-1 font-regular">새 채팅</span>
        </ListCell>
        <ListCell
          onClick={handleSearchClick}
          leadingContent={<IconSearch width={16} height={16} />}
          verticalPadding="small"
          sx={{ cursor: 'pointer', alignItems: 'center' }}
        >
          <span className="text-caption-1 font-regular">채팅 검색</span>
        </ListCell>
      </List>

      <div className="self-stretch pt-3 pb-1">
        <p className="text-caption-1 font-medium text-label-alternative">최근</p>
      </div>

      <ScrollArea
        size="small"
        sx={{ flex: 1, overflowX: 'hidden', marginLeft: '-16px', marginRight: '-16px', padding: '4px' }}
      >
        <List>
          {chatSessions.map((chat) => (
            <ChatListItem
              key={chat.chatSessionId}
              chat={chat}
              projectId={projectId}
              selectedChatId={selectedChatId}
              hoveredChatId={hoveredChatId}
              menuOpenChatId={menuOpenChatId}
              currentChatSessionId={currentChatSessionId}
              onSelect={onSelectChat}
              onHoverChange={onHoverChange}
              onMenuOpenChange={onMenuOpenChange}
              onCurrentChatClear={onCurrentChatClear}
            />
          ))}
        </List>
      </ScrollArea>
    </div>
  );
}