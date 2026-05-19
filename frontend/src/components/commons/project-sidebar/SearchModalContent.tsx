'use client';

import { ContentBadge, TextField, TextFieldContent } from '@wanteddev/wds';
import { IconSearchThick } from '@wanteddev/wds-icon';
import Link from 'next/link';

import { type SearchResultItem, useSearchModalForm } from './useSearchModalForm';

interface SearchModalContentProps {
  /** 검색 대상 프로젝트 ID. */
  projectId: number;
  /**
   * 검색 결과 카드를 클릭했을 때 호출.
   * 라우팅은 `Link`가 처리하므로 본 콜백은 보통 모달 닫기·로깅 용도로 사용한다.
   */
  onResultClick?: (item: SearchResultItem) => void;
}

/**
 * 사이드바 검색 모달 콘텐츠.
 *
 * - 백드롭/ESC/외부 클릭 닫힘은 공통 모달(`useModal` + `commons/modal`)에 위임.
 * - 입력 디바운스 + API 호출 + 정규화는 `useSearchModalForm` 훅에 분리.
 * - 결과 카드는 `next/link`로 노드 상세 페이지로 SPA 이동.
 */
const formatUpdatedAt = (value?: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const pad2 = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`;
};

export const SearchModalContent = ({ projectId, onResultClick }: SearchModalContentProps) => {
  const { query, setQuery, results, isLoading, hasError, hasQuery } = useSearchModalForm({
    projectId,
  });

  return (
    <div className="flex h-144 w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-3">
        <TextField
          id="project-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="검색어를 입력해 주세요."
          width="100%"
          leadingContent={
            <TextFieldContent variant="icon">
              <IconSearchThick className="text-label-alternative h-5 w-5" aria-hidden="true" />
            </TextFieldContent>
          }
        />

        {hasQuery && isLoading && <p className="text-label-1 text-label-alternative">검색 중…</p>}
        {hasQuery && !isLoading && !hasError && (
          <p className="text-label-1 text-label-alternative">{results.length}개의 검색 결과</p>
        )}
      </div>

      {hasQuery && !isLoading && !hasError && results.length > 0 && (
        <ul className="flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto pr-2">
          {results.map((item) => {
            const updatedAtLabel = formatUpdatedAt(item.updatedAt);
            const isMainNode = !item.number.includes('.');
            return (
              <li key={item.nodeId}>
                <Link
                  // 노드 상세 페이지는 base path(`/projects/{projectId}/nodes/{nodeId}`)에서
                  // `/nodes/{id}/note` 로 redirect 처리되어 projectId 없이 풀려 잘못된 페이지로 빠진다.
                  // 검색 결과는 곧장 `note` 탭까지 끝까지 명시해 redirect 우회.
                  href={`/projects/${projectId}/nodes/${item.nodeId}/note`}
                  onClick={() => onResultClick?.(item)}
                  className="hover:bg-fill-alternative flex w-full items-start gap-2.5 rounded-lg p-4 transition-colors duration-150"
                >
                  <div className="shrink-0">
                    {isMainNode ? (
                      <ContentBadge
                        size="small"
                        variant="solid"
                        color="accent"
                        className="!bg-primary-40/10 !text-primary-40"
                      >
                        #{item.number}
                      </ContentBadge>
                    ) : (
                      <ContentBadge size="small" variant="outlined" color="neutral">
                        #{item.number}
                      </ContentBadge>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-headline-2 text-label-normal min-w-0 flex-1 truncate font-medium">
                        {item.title}
                      </span>
                      {updatedAtLabel && (
                        <span className="text-caption-1 text-label-assistive shrink-0 font-normal">
                          {updatedAtLabel}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-caption-1 text-label-alternative truncate font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {hasQuery && !isLoading && !hasError && results.length === 0 && (
        <p className="text-body-2 text-label-alternative">검색 결과가 없어요.</p>
      )}

      {hasQuery && !isLoading && hasError && (
        <p className="text-body-2 text-status-negative">검색에 실패했어요. 다시 시도해 주세요.</p>
      )}
    </div>
  );
};

SearchModalContent.displayName = 'SearchModalContent';
