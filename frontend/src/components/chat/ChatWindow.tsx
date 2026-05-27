'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { privateApi } from '@/api';
import { type MultiSelectInputValue, type NodeOption, type UserOption } from '@/components/commons/custom-input/MultiSelectInput';
import { useStartChat, useSendMessage, useGetAllChatSessions, useGetChatSessionDetail, useGetReferenceNodes, useGetReferenceUsers, useAddChatNode, useRemoveChatNode } from '@/queries/chat';
import { chatKeys } from '@/queries/keys/chatKeys';
import { nodeKeys } from '@/queries/keys/nodeKeys';
import { ChatHeader } from './ChatHeader';
import { ChatInputArea } from './ChatInputArea';
import { ChatMessageList } from './ChatMessageList';
import { ChatSidebar } from './sidebar/ChatSidebar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  shouldAnimate?: boolean;
}

interface ChatWindowProps {
  onClose: () => void;
  isNodeSidebarOpen: boolean;
  sidebarWidth: number;
}

export function ChatWindow({ onClose, isNodeSidebarOpen, sidebarWidth }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<MultiSelectInputValue>({
    text: '',
    mentions: [],
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatSessionId, setChatSessionId] = useState<number | null>(null);
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<number | null>(null);
  const params = useParams();
  const projectId = Number(params?.projectId);
  const queryClient = useQueryClient();
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 다이얼로그, 모달, 메뉴 클릭은 무시
      if (
        target.closest('[role="dialog"]') ||
        target.closest('[role="menu"]') ||
        target.closest('[data-wds-component="dialog"]') ||
        target.closest('[aria-modal="true"]') ||
        target.closest('.z-9999')
      ) {
        return;
      }

      if (chatWindowRef.current && !chatWindowRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 컴포넌트 마운트 시 이전 세션 복원
  useEffect(() => {
    const savedSessionId = sessionStorage.getItem(`chat_session_${projectId}`);
    if (savedSessionId) {
      const sessionId = Number(savedSessionId);
      setSelectedChatId(sessionId);
      setChatSessionId(sessionId);
      // 캐시된 데이터를 모두 제거하고 새로 가져오기
      void queryClient.removeQueries({
        queryKey: chatKeys.details(),
      });
    }
  }, [projectId, queryClient]);

  // 세션 ID 변경 시 sessionStorage에 저장
  useEffect(() => {
    if (chatSessionId !== null) {
      sessionStorage.setItem(`chat_session_${projectId}`, String(chatSessionId));
    }
  }, [chatSessionId, projectId]);

  // 채팅 목록 조회
  const { data: chatSessionsData } = useGetAllChatSessions({
    projectId,
    size: 20,
  });

  const chatSessions = chatSessionsData?.data?.content || [];

  // 선택된 채팅 상세 조회 
  const { data: chatDetail } = useGetChatSessionDetail({
    projectId,
    chatSessionId: selectedChatId ?? chatSessionId ?? 0,
  });

  // 참조 가능한 노드 조회
  const { data: referenceNodesData } = useGetReferenceNodes(projectId);

  // 참조 가능한 사용자 조회
  const { data: referenceUsersData } = useGetReferenceUsers(projectId);

  // 노드 옵션 생성
  const nodes = referenceNodesData?.data?.nodes || [];
  const nodeOptions: NodeOption[] = nodes.map((node) => ({
    id: node.nodeId?.toString() || '',
    label: node.title || '',
    nodeId: node.nodeId || 0,
    number: node.number || '',
  }));

  // 사용자 옵션 생성
  const users = referenceUsersData?.data?.users || [];
  const userOptions: UserOption[] = users.map((user) => ({
    id: user.userId?.toString() || '',
    label: user.nickname || '',
    profileImageUrl: user.profileImageUrl,
  }));

  const addChatNodeMutation = useAddChatNode();
  const removeChatNodeMutation = useRemoveChatNode();

  // 서버에서 로드된 채팅 메시지 (이전 채팅 조회용)
  const serverMessages: Message[] = !chatDetail?.data?.messages
    ? []
    : chatDetail.data.messages
        .map((msg) => ({
          id: msg.messageId?.toString() || '',
          role: (msg.messageType === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: msg.content || '',
          timestamp: msg.createdAt || new Date().toISOString(),
        }))
        .reverse(); // 최신순 → 오래된 순으로 변경

  // 현재 세션 ID
  const currentChatSessionId = selectedChatId ?? chatSessionId;

  // 채팅을 선택했을 때 서버 메시지를 로컬 messages로 복사
  useEffect(() => {
    if (selectedChatId !== null && serverMessages.length > 0) {
      setMessages(serverMessages);
      setChatSessionId(selectedChatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatId, serverMessages.length]);

  // 채팅 상세에서 참조 노드/사용자 복원
  useEffect(() => {
    if (selectedChatId !== null && chatDetail?.data) {
      const mentions: MultiSelectInputValue['mentions'] = [];

      const referencedNodes = chatDetail.data.referencedNodes || [];
      referencedNodes.forEach((node: { nodeId?: number; number?: string; title?: string }) => {
        if (node.nodeId) {
          mentions.push({
            type: 'node',
            id: node.nodeId.toString(),
          });
        }
      });

      // TODO: referencedUsers가 API에 추가되면 복원 로직 추가

      if (mentions.length > 0) {
        setInputValue((prev) => ({ ...prev, mentions }));
      }
    }
  }, [selectedChatId, chatDetail]);

  // 화면에 표시할 메시지 (항상 messages 사용)
  const visibleMessages = messages.length > 0 ? messages : serverMessages;

  const startChatMutation = useStartChat();
  const sendMessageMutation = useSendMessage();

  const handleSend = (value: MultiSelectInputValue) => {
    if (!value.text.trim() || startChatMutation.isPending || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: value.text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue({ text: '', mentions: [] });

    // mentions에서 노드와 사용자 ID 추출
    const nodeIds = value.mentions
      .filter((mention) => mention.type === 'node')
      .map((mention) => Number(mention.id));
    const referenceUserIds = value.mentions
      .filter((mention) => mention.type === 'user')
      .map((mention) => Number(mention.id));

    // 첫 메시지인 경우 (세션이 없는 경우)
    if (!currentChatSessionId) {
      startChatMutation.mutate(
        {
          projectId,
          content: value.text.trim(),
          nodeIds: nodeIds.length > 0 ? nodeIds : undefined,
          referenceUserIds: referenceUserIds.length > 0 ? referenceUserIds : undefined,
        },
        {
          onSuccess: async (data) => {
            if (data.data) {
              // 세션 ID 설정
              const newChatSessionId = data.data.chatSessionId;
              if (newChatSessionId) {
                setChatSessionId(newChatSessionId);
              }

              // AI 응답 추가
              const assistantMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.data.aiResponse || '',
                timestamp: data.data.createdAt || new Date().toISOString(),
                shouldAnimate: true,
              };
              setMessages((prev) => [...prev, assistantMessage]);

              // 채팅 목록 새로고침 (AI가 생성한 제목이 반영됨)
              void queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

              // 백그라운드에서 깜빡임 없이 업데이트
              try {
                const flowchartResponse = await privateApi.node.getFlowchart(projectId);
                if (flowchartResponse.data.data) {
                  queryClient.setQueryData(nodeKeys.flowchart(projectId), flowchartResponse.data.data);
                }
              } catch (error) {
                console.error('Failed to update flowchart:', error);
              }

              // 노드 리스트와 칸반도 백그라운드에서 업데이트
              void queryClient.invalidateQueries({ queryKey: nodeKeys.list(projectId) });
              void queryClient.invalidateQueries({ queryKey: nodeKeys.kanban(projectId) });
            }
          },
          onError: () => {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
          },
        }
      );
    } else {
      // 기존 세션에 메시지 추가
      sendMessageMutation.mutate(
        {
          projectId,
          chatSessionId: currentChatSessionId,
          content: value.text.trim(),
          referenceNodeIds: nodeIds.length > 0 ? nodeIds : undefined,
          referenceUserIds: referenceUserIds.length > 0 ? referenceUserIds : undefined,
        },
        {
          onSuccess: async (data) => {
            // AI 응답 추가
            if (data.data) {
              const assistantMessage: Message = {
                id: data.data.messageId?.toString() || Date.now().toString(),
                role: 'assistant',
                content: data.data.content || '',
                timestamp: data.data.createdAt || new Date().toISOString(),
                shouldAnimate: true,
              };
              setMessages((prev) => [...prev, assistantMessage]);
            }

            try {
              const flowchartResponse = await privateApi.node.getFlowchart(projectId);
              if (flowchartResponse.data.data) {
                queryClient.setQueryData(nodeKeys.flowchart(projectId), flowchartResponse.data.data);
              }
            } catch (error) {
              console.error('Failed to update flowchart:', error);
            }

            // 선택된 채팅의 메시지 목록도 백그라운드에서 조용히 업데이트
            if (currentChatSessionId) {
              try {
                const chatDetailResponse = await privateApi.chat.getChatSessionDetail(projectId, currentChatSessionId);
                if (chatDetailResponse.data.data) {
                  queryClient.setQueryData(chatKeys.detail(projectId, currentChatSessionId), chatDetailResponse.data.data);
                }
              } catch (error) {
                console.error('Failed to update chat detail:', error);
              }
            }

            // 노드 리스트와 칸반은 invalidate
            void queryClient.invalidateQueries({ queryKey: nodeKeys.list(projectId) });
            void queryClient.invalidateQueries({ queryKey: nodeKeys.kanban(projectId) });
          },
          onError: () => {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
          },
        }
      );
    }
  };

  const handleSelectChat = (chatId: number | null) => {
    setSelectedChatId(chatId);
  };

  const handleNewChat = () => {
    // 세션을 생성하지 않고 상태만 초기화, 실제 세션은 첫 메시지를 보낼 때 생성됨
    setChatSessionId(null);
    setSelectedChatId(null);
    setMessages([]);
    setInputValue({ text: '', mentions: [] });
  };

  return (
    <>
      <div
        ref={chatWindowRef}
        className={`fixed bottom-6 z-50 pointer-events-auto ${isSidebarOpen ? 'shadow-normal-small' : ''}`}
        style={{
          right: isNodeSidebarOpen ? 24 + sidebarWidth : 24,
          transition: 'right 0.25s ease',
        }}
      >
        <div className="relative w-96 h-[563px]">
          <ChatSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onNewChat={handleNewChat}
            chatSessions={chatSessions}
            projectId={projectId}
            selectedChatId={selectedChatId}
            hoveredChatId={hoveredChatId}
            menuOpenChatId={menuOpenChatId}
            currentChatSessionId={chatSessionId}
            onSelectChat={handleSelectChat}
            onHoverChange={setHoveredChatId}
            onMenuOpenChange={setMenuOpenChatId}
            onCurrentChatClear={(deletedChatSessionId) => {
              setChatSessionId(null);
              setSelectedChatId(null);
              setMessages([]);

              if (deletedChatSessionId) {
                sessionStorage.removeItem(`chat_session_${projectId}`);
              }
            }}
          />

          <div className={`relative w-full h-full bg-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'rounded-r-xl' : 'rounded-xl shadow-normal-small'}`}>
            <ChatHeader
              isSidebarOpen={isSidebarOpen}
              onOpenSidebar={() => setIsSidebarOpen(true)}
            />

            <ChatMessageList
              messages={visibleMessages}
              isLoading={startChatMutation.isPending || sendMessageMutation.isPending}
            />

            <ChatInputArea
              value={inputValue}
              onChange={(newValue) => {
                const addedNodes = newValue.mentions.filter(
                  (mention) =>
                    mention.type === 'node' &&
                    !inputValue.mentions.some((prev) => prev.id === mention.id && prev.type === 'node')
                );

                const removedNodes = inputValue.mentions.filter(
                  (mention) =>
                    mention.type === 'node' &&
                    !newValue.mentions.some((next) => next.id === mention.id && next.type === 'node')
                );

                if (currentChatSessionId) {
                  addedNodes.forEach((node) => {
                    addChatNodeMutation.mutate({
                      projectId,
                      chatSessionId: currentChatSessionId,
                      nodeId: Number(node.id),
                    });
                  });

                  removedNodes.forEach((node) => {
                    removeChatNodeMutation.mutate({
                      projectId,
                      chatSessionId: currentChatSessionId,
                      nodeId: Number(node.id),
                    });
                  });
                }

                setInputValue(newValue);
              }}
              onSubmit={handleSend}
              userOptions={userOptions}
              nodeOptions={nodeOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
}