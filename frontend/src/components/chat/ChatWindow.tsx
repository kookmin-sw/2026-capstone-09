'use client';

import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { privateApi } from '@/api';
import { type MultiSelectInputValue, type NodeOption, type UserOption } from '@/components/commons/custom-input/MultiSelectInput';
import { useCreateChatSession, useSendMessage, useGetAllChatSessions, useGetChatSessionDetail, useGetReferenceNodes, useAddChatNode, useRemoveChatNode } from '@/queries/chat';
import { chatKeys } from '@/queries/keys/chatKeys';
import { ChatHeader } from './ChatHeader';
import { ChatInputArea } from './ChatInputArea';
import { ChatMessageList } from './ChatMessageList';
import { ChatSidebar } from './ChatSidebar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  shouldAnimate?: boolean;
}

interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<MultiSelectInputValue>({
    text: '',
    mentions: [],
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatSessionId, setChatSessionId] = useState<number | null>(null);
  const [isNodeSidebarOpen, setIsNodeSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<number | null>(null);
  const params = useParams();
  const projectId = Number(params?.projectId);
  const isValidProjectId = Number.isFinite(projectId) && projectId > 0;
  const queryClient = useQueryClient();

  // NodeSidebar 너비 계산
  useEffect(() => {
    const updateSidebarWidth = () => {
      const width = window.innerWidth * 0.4;
      setSidebarWidth(width);
    };

    updateSidebarWidth();
    window.addEventListener('resize', updateSidebarWidth);
    return () => window.removeEventListener('resize', updateSidebarWidth);
  }, []);

  // NodeSidebar 열림 상태 감지 (custom event 사용)
  useEffect(() => {
    const checkSidebar = () => {
      const sidebarState = sessionStorage.getItem('node_sidebar_open');
      setIsNodeSidebarOpen(!!sidebarState);
    };

    // 초기 상태 확인
    checkSidebar();

    // custom event 리스너 등록
    const handleSidebarChange = () => {
      checkSidebar();
    };

    window.addEventListener('storage', handleSidebarChange);
    window.addEventListener('sidebar-state-change', handleSidebarChange);

    return () => {
      window.removeEventListener('storage', handleSidebarChange);
      window.removeEventListener('sidebar-state-change', handleSidebarChange);
    };
  }, []);

  // 채팅 목록 조회
  const { data: chatSessionsData } = useGetAllChatSessions({
    projectId,
    size: 20,
  });

  const chatSessions = chatSessionsData?.data?.content || [];

  // 선택된 채팅 상세 조회
  const { data: chatDetail } = useGetChatSessionDetail({
    projectId,
    chatSessionId: selectedChatId ?? 0,
  });

  // 참조 가능한 노드 조회
  const { data: referenceNodesData } = useGetReferenceNodes(projectId);

  // 프로젝트 멤버 조회
  const { data: membersData } = useQuery({
    queryKey: ['projectMembers', projectId],
    queryFn: async () => {
      const response = await privateApi.projectMember.getAllMembers(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });

  // 노드 옵션 생성
  const nodes = referenceNodesData?.data?.nodes || [];
  const nodeOptions: NodeOption[] = nodes.map((node) => ({
    id: node.nodeId?.toString() || '',
    label: node.title || '',
    nodeId: node.nodeId || 0,
    number: node.number || '',
  }));

  // 사용자 옵션 생성
  const members = membersData?.data?.members || [];
  const userOptions: UserOption[] = members.map((member) => ({
    id: member.userId?.toString() || '',
    label: member.nickname || member.email || '',
    profileImageUrl: member.profileImageUrl,
  }));

  const addChatNodeMutation = useAddChatNode();
  const removeChatNodeMutation = useRemoveChatNode();

  // 서버에서 로드된 채팅 메시지 (이전 채팅 조회용)
  const serverMessages: Message[] = !chatDetail?.data?.messages
    ? []
    : chatDetail.data.messages.map((msg) => ({
        id: msg.messageId?.toString() || '',
        role: msg.messageType === 'USER' ? 'user' : 'assistant',
        content: msg.content || '',
        timestamp: msg.createdAt || new Date().toISOString(),
      }));

  // 현재 세션 ID
  const currentChatSessionId = selectedChatId ?? chatSessionId;

  // 화면에 표시할 메시지
  const isViewingExistingChat = selectedChatId !== null && selectedChatId !== chatSessionId;
  const visibleMessages = isViewingExistingChat ? serverMessages : messages;

  const createChatMutation = useCreateChatSession();

  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    if (!isValidProjectId || chatSessionId || selectedChatId || createChatMutation.isPending) {
      return;
    }

    createChatMutation.mutate(
      {
        projectId,
        title: '새 채팅',
      },
      {
        onSuccess: (data) => {
          const id = data.data?.chatSessionId;
          if (!id) return;

          setChatSessionId(id);
          setSelectedChatId(id);
          setMessages([]);
        },
      }
    );
  }, [projectId, isValidProjectId, chatSessionId, selectedChatId, createChatMutation.isPending]);

  const handleSend = (value: MultiSelectInputValue) => {
    if (!value.text.trim() || sendMessageMutation.isPending || !currentChatSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: value.text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue({ text: '', mentions: [] });

    // mentions에서 노드와 사용자 ID 추출
    const referenceNodeIds = value.mentions
      .filter((mention) => mention.type === 'node')
      .map((mention) => Number(mention.id));
    const referenceUserIds = value.mentions
      .filter((mention) => mention.type === 'user')
      .map((mention) => Number(mention.id));

    sendMessageMutation.mutate(
      {
        projectId,
        chatSessionId: currentChatSessionId,
        content: value.text.trim(),
        referenceNodeIds: referenceNodeIds.length > 0 ? referenceNodeIds : undefined,
        referenceUserIds: referenceUserIds.length > 0 ? referenceUserIds : undefined,
      },
      {
        onSuccess: (data) => {
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

          // 선택된 채팅의 메시지 목록 새로고침
          if (currentChatSessionId) {
            void queryClient.invalidateQueries({
              queryKey: chatKeys.detail(projectId, currentChatSessionId),
            });
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
  };

  const handleNewChat = () => {
    createChatMutation.mutate(
      {
        projectId,
        title: '새 채팅',
      },
      {
        onSuccess: (data) => {
          if (data.data?.chatSessionId) {
            setChatSessionId(data.data.chatSessionId);
            setSelectedChatId(data.data.chatSessionId);
            setMessages([]);
            setInputValue({ text: '', mentions: [] });

            // 채팅 목록 새로고침
            void queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
          }
        },
        onError: () => {},
      }
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-35"
        onClick={onClose}
        aria-label="채팅 닫기"
      />

      <div
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
            onSelectChat={setSelectedChatId}
            onHoverChange={setHoveredChatId}
            onMenuOpenChange={setMenuOpenChatId}
            onCurrentChatClear={() => {
              setChatSessionId(null);
              setMessages([]);
            }}
          />

          <div className={`relative w-full h-full bg-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'rounded-r-xl' : 'rounded-xl shadow-normal-small'}`}>
            <ChatHeader
              isSidebarOpen={isSidebarOpen}
              onOpenSidebar={() => setIsSidebarOpen(true)}
            />

            <ChatMessageList
              messages={visibleMessages}
              isLoading={sendMessageMutation.isPending}
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