'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { privateApi } from '@/api';
import { chatKeys } from './keys/chatKeys';

interface CreateChatSessionParams {
  projectId: number;
  title: string;
}

interface SendMessageParams {
  projectId: number;
  chatSessionId: number;
  content: string;
  referenceNodeIds?: number[];
  referenceUserIds?: number[];
}

interface AddChatNodeParams {
  projectId: number;
  chatSessionId: number;
  nodeId: number;
}

interface UpdateChatSessionParams {
  projectId: number;
  chatSessionId: number;
  title: string;
}

interface DeleteChatSessionParams {
  projectId: number;
  chatSessionId: number;
}

interface RemoveChatNodeParams {
  projectId: number;
  chatSessionId: number;
  nodeId: number;
}

interface GetAllChatSessionsParams {
  projectId: number;
  search?: string;
  cursorId?: number;
  size?: number;
}

interface GetChatSessionDetailParams {
  projectId: number;
  chatSessionId: number;
  cursorId?: number;
  size?: number;
}

// 채팅 세션 목록 조회
export function useGetAllChatSessions({ projectId, search, cursorId, size = 20 }: GetAllChatSessionsParams) {
  return useQuery({
    queryKey: chatKeys.list(projectId, { search, cursorId, size }),
    queryFn: async () => {
      const response = await privateApi.chat.getAllChatSessions(projectId, { search, cursorId, size });
      return response.data;
    },
    enabled: !!projectId,
  });
}

// 채팅 상세 조회
export function useGetChatSessionDetail({ projectId, chatSessionId, cursorId, size = 30 }: GetChatSessionDetailParams) {
  return useQuery({
    queryKey: chatKeys.detail(projectId, chatSessionId, { cursorId, size }),
    queryFn: async () => {
      const response = await privateApi.chat.getChatSessionDetail(projectId, chatSessionId, { cursorId, size });
      return response.data;
    },
    enabled: !!projectId && !!chatSessionId,
  });
}

// 참조 가능한 노드 조회
export function useGetReferenceNodes(projectId: number) {
  return useQuery({
    queryKey: chatKeys.referenceNodes(projectId),
    queryFn: async () => {
      const response = await privateApi.chat.getReferenceNodes(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });
}


// 채팅 세션 생성
export function useCreateChatSession() {
  return useMutation({
    mutationFn: async ({ projectId, title }: CreateChatSessionParams) => {
      const response = await privateApi.chat.createChatSession(projectId, { title });
      return response.data;
    },
  });
}

// 메시지 전송
export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ projectId, chatSessionId, content, referenceNodeIds, referenceUserIds }: SendMessageParams) => {
      const response = await privateApi.chat.sendMessage(projectId, chatSessionId, {
        content,
        referenceNodeIds,
        referenceUserIds,
      });
      return response.data;
    },
  });
}

// 참조 노드 추가
export function useAddChatNode() {
  return useMutation({
    mutationFn: async ({ projectId, chatSessionId, nodeId }: AddChatNodeParams) => {
      const response = await privateApi.chat.addChatNode(projectId, chatSessionId, { nodeId });
      return response.data;
    },
  });
}

// 채팅 제목 수정
export function useUpdateChatSession() {
  return useMutation({
    mutationFn: async ({ projectId, chatSessionId, title }: UpdateChatSessionParams) => {
      const response = await privateApi.chat.updateChatSession(projectId, chatSessionId, { title });
      return response.data;
    },
  });
}

// 채팅 삭제
export function useDeleteChatSession() {
  return useMutation({
    mutationFn: async ({ projectId, chatSessionId }: DeleteChatSessionParams) => {
      const response = await privateApi.chat.deleteChatSession(projectId, chatSessionId);
      return response.data;
    },
  });
}

// 참조 노드 제거
export function useRemoveChatNode() {
  return useMutation({
    mutationFn: async ({ projectId, chatSessionId, nodeId }: RemoveChatNodeParams) => {
      const response = await privateApi.chat.removeChatNode(projectId, chatSessionId, nodeId);
      return response.data;
    },
  });
}