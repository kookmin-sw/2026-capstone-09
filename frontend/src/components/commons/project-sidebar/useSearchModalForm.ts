'use client';

import { useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { useErrorToast } from '@/hooks/useErrorToast';

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

/**
 * 사이드바 검색 모달의 폼 상태 + 검색 API 호출을 담당하는 커스텀 훅.
 *
 * - `query`        : 사용자가 입력 중인 검색어 원본 (TextField와 양방향 바인딩)
 * - `results`      : 디바운스된 검색어로 호출한 API 응답을 UI 표현용으로 정규화한 결과
 * - `isLoading`    : 디바운스 + 네트워크 응답 대기 중 여부
 * - `error`        : API 호출 실패 시 사용자에게 보여줄 메시지 (null이면 에러 없음)
 * - `hasQuery`     : trim 후에도 검색어가 남아 있는지
 * - `reset`        : 모달이 닫힐 때 호출해 상태를 초기화
 *
 * 빠르게 타이핑하는 동안 직전 요청을 `cancelled` 플래그로 무효화해 항상 마지막 입력만 반영되도록 한다.
 */
export const useSearchModalForm = ({
  projectId,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseSearchModalFormParams) => {
  const showErrorToast = useErrorToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;

  useEffect(() => {
    if (!hasQuery) {
      setResults([]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    const timer = setTimeout(async () => {
      try {
        const response = await privateApi.node.search(projectId, { query: trimmed });
        if (cancelled) return;
        const nodes = response.data.data?.nodes ?? [];
        const normalized: SearchResultItem[] = nodes
          .filter((node): node is typeof node & { nodeId: number } => node.nodeId !== undefined)
          .map((node) => ({
            nodeId: node.nodeId,
            number: node.number ?? '',
            title: node.title ?? '',
            description: node.description,
            updatedAt: node.updatedAt,
            status: node.status,
          }));
        setResults(normalized);
        setHasError(false);
      } catch (caught) {
        if (cancelled) return;
        showErrorToast(caught, '검색에 실패했어요.');
        setHasError(true);
        setResults([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, projectId, debounceMs, hasQuery, showErrorToast]);

  const reset = () => {
    setQuery('');
    setResults([]);
    setHasError(false);
    setIsLoading(false);
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasError,
    hasQuery,
    reset,
  };
};
