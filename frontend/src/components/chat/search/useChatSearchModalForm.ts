'use client';

import { useEffect, useState } from 'react';
import { useGetAllChatSessions } from '@/queries/chat';

interface UseChatSearchModalFormParams {
  projectId: number;
  debounceMs?: number;
}

export interface ChatSearchResultItem {
  chatSessionId: number;
  title: string;
}

const DEFAULT_DEBOUNCE_MS = 300;

export const useChatSearchModalForm = ({
  projectId,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseChatSearchModalFormParams) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedQuery(hasQuery ? trimmed : ''),
      hasQuery ? debounceMs : 0
    );
    return () => clearTimeout(timer);
  }, [trimmed, hasQuery, debounceMs]);

  const { data, isFetching, isError } = useGetAllChatSessions({
    projectId,
    search: debouncedQuery || undefined,
    size: 20,
  });

  const results: ChatSearchResultItem[] = (data?.data?.content ?? [])
    .filter((chat): chat is typeof chat & { chatSessionId: number } => chat.chatSessionId !== undefined && chat.chatSessionId !== null)
    .map((chat) => ({
      chatSessionId: chat.chatSessionId,
      title: chat.title ?? '제목 없음',
    }));

  const isLoading = (hasQuery && debouncedQuery !== trimmed) || isFetching;

  const reset = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasError: isError,
    hasQuery,
    reset,
  };
};