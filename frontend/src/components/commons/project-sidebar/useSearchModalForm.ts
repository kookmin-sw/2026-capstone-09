'use client';

import { useEffect, useState } from 'react';

import { useErrorToast } from '@/hooks/useErrorToast';
import { useSearchNodesQuery } from '@/queries/search';

interface UseSearchModalFormParams {
  /** 검색 대상 프로젝트 ID. /projects/{projectId} URL의 파라미터를 그대로 넘긴다. */
  projectId: number;
  /** 입력 디바운스 시간(ms). 기본 300. */
  debounceMs?: number;
}

/**
 * 검색 모달이 화면에 그려야 하는 결과 항목.
 * 서버 응답(`SearchItem`) 중 사용하지 않는 필드는 의도적으로 제외해 컴포넌트가 가져갈 모양만 남긴다.
 */
export interface SearchResultItem {
  nodeId: number;
  number: string;
  title: string;
  description?: string;
  updatedAt?: string;
  status?: 'WAITING' | 'IN_PROGRESS' | 'ON_HOLD' | 'DONE' | 'CLOSED';
}

const DEFAULT_DEBOUNCE_MS = 300;

export const useSearchModalForm = ({
  projectId,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseSearchModalFormParams) => {
  const showErrorToast = useErrorToast();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;

  useEffect(() => {
    if (!hasQuery) {
      setDebouncedQuery('');
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(trimmed), debounceMs);
    return () => clearTimeout(timer);
  }, [trimmed, hasQuery, debounceMs]);

  const { data, isFetching, isError } = useSearchNodesQuery(projectId, debouncedQuery);

  useEffect(() => {
    if (isError) showErrorToast(null, '검색에 실패했어요.');
  }, [isError, showErrorToast]);

  const results: SearchResultItem[] = (data ?? [])
    .filter((node): node is typeof node & { nodeId: number } => node.nodeId !== undefined)
    .map((node) => ({
      nodeId: node.nodeId,
      number: node.number ?? '',
      title: node.title ?? '',
      description: node.description,
      updatedAt: node.updatedAt,
      status: node.status,
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
