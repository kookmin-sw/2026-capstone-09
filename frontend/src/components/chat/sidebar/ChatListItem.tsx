'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ListCell, Menu, MenuTrigger, MenuContent, MenuList, IconButton } from '@wanteddev/wds';
import { IconMoreHorizontal } from '@wanteddev/wds-icon';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import { useUpdateChatSession, useDeleteChatSession } from '@/queries/chat';
import { chatKeys } from '@/queries/keys/chatKeys';
import { ChatDeleteDialog } from '../dialogs/ChatDeleteDialog';
import { ChatRenameDialog } from '../dialogs/ChatRenameDialog';

interface ChatListItemProps {
  chat: {
    chatSessionId?: number | null;
    title?: string | null;
  };
  projectId: number;
  selectedChatId: number | null;
  hoveredChatId: number | null;
  menuOpenChatId: number | null;
  currentChatSessionId: number | null;
  onSelect: (chatId: number | null) => void;
  onHoverChange: (chatId: number | null) => void;
  onMenuOpenChange: (chatId: number | null) => void;
  onCurrentChatClear: (deletedChatSessionId?: number) => void;
}

export function ChatListItem({
  chat,
  projectId,
  selectedChatId,
  hoveredChatId,
  menuOpenChatId,
  currentChatSessionId,
  onSelect,
  onHoverChange,
  onMenuOpenChange,
  onCurrentChatClear,
}: ChatListItemProps) {
  const queryClient = useQueryClient();
  const { openDialog, closeDialog } = useDialog();
  const updateChatSessionMutation = useUpdateChatSession();
  const deleteChatSessionMutation = useDeleteChatSession();

  const handleChatClick = () => {
    onMenuOpenChange(null);
    onSelect(chat.chatSessionId || null);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuOpenChange(null);

    openDialog({
      content: (
        <ChatRenameDialog
          currentTitle={chat.title || ''}
          onConfirm={(newTitle) => {
            closeDialog();
            updateChatSessionMutation.mutate(
              {
                projectId,
                chatSessionId: chat.chatSessionId || 0,
                title: newTitle,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
                },
              }
            );
          }}
          onCancel={closeDialog}
        />
      ),
      closeOnBackdrop: true,
      closeOnEsc: true,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuOpenChange(null);

    openDialog({
      content: (
        <ChatDeleteDialog
          chatTitle={chat.title || ''}
          onConfirm={() => {
            closeDialog();
            deleteChatSessionMutation.mutate(
              {
                projectId,
                chatSessionId: chat.chatSessionId || 0,
              },
              {
                onSuccess: async () => {
                  const deletedChatSessionId = chat.chatSessionId || 0;

                  // 삭제된 채팅의 detail 캐시 제거
                  queryClient.removeQueries({
                    queryKey: chatKeys.detail(projectId, deletedChatSessionId),
                  });

                  // 삭제한 채팅이 현재 보고 있는 채팅이면 상태 초기화
                  if (
                    deletedChatSessionId === selectedChatId ||
                    deletedChatSessionId === currentChatSessionId
                  ) {
                    onCurrentChatClear(deletedChatSessionId);
                  }

                  // 목록 새로고침
                  await queryClient.refetchQueries({
                    queryKey: chatKeys.lists(),
                    exact: false,
                    type: 'active'
                  });
                },
              }
            );
          }}
          onCancel={closeDialog}
        />
      ),
      closeOnBackdrop: true,
      closeOnEsc: true,
    });
  };

  return (
    <ListCell
      key={chat.chatSessionId}
      selected={selectedChatId === chat.chatSessionId}
      onClick={handleChatClick}
      onMouseEnter={() => onHoverChange(chat.chatSessionId || null)}
      onMouseLeave={() => {
        onHoverChange(null);
      }}
      verticalPadding="small"
      sx={{
        cursor: 'pointer',
        alignItems: 'center',
        overflow: 'hidden',
        ...(menuOpenChatId === chat.chatSessionId
          ? {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          : selectedChatId === chat.chatSessionId
          ? {
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
            }
          : {}),
      }}
      trailingContent={
        (menuOpenChatId === null || menuOpenChatId === chat.chatSessionId) &&
        (hoveredChatId === chat.chatSessionId || menuOpenChatId === chat.chatSessionId) ? (
          <div
            style={{
              marginRight: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Menu
              open={menuOpenChatId === chat.chatSessionId}
              onOpenChange={(open) => {
                if (!open) {
                  onMenuOpenChange(null);
                }
              }}
            >
              <MenuTrigger>
                <IconButton
                  size={18}
                  aria-label="채팅 메뉴"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (menuOpenChatId && menuOpenChatId !== chat.chatSessionId) {
                      return;
                    }
                    onMenuOpenChange(
                      menuOpenChatId === chat.chatSessionId ? null : chat.chatSessionId || null
                    );
                  }}
                >
                  <IconMoreHorizontal className="shrink-0" width={18} height={18} />
                </IconButton>
              </MenuTrigger>
              <MenuContent
                position="bottom-start"
                sx={() => ({
                  width: '100px !important',
                  minWidth: '100px !important',
                  maxWidth: '100px !important'
                })}
              >
                <MenuList>
                  <CustomMenuItem
                    value="rename"
                    onClick={handleRename}
                  >
                    이름 변경
                  </CustomMenuItem>
                  <CustomMenuItem
                    value="delete"
                    textProps={{
                      variant: 'label2',
                      sx: (theme) => ({ color: theme.semantic.status.negative }),
                    }}
                    onClick={handleDelete}
                  >
                    삭제
                  </CustomMenuItem>
                </MenuList>
              </MenuContent>
            </Menu>
          </div>
        ) : null
      }
    >
      <span className="text-caption-1 font-regular truncate block pl-4">{chat.title}</span>
    </ListCell>
  );
}