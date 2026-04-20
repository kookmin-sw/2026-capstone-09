'use client';

import { ContentBadge, TextField, TextFieldContent } from '@wanteddev/wds';
import { IconSearchThick } from '@wanteddev/wds-icon';
import { useMemo, useState } from 'react';

import { EXAMPLE_SEARCH_RESULTS } from '@/constants/exampleConstant';

// WDS TextField 포커스 테두리·캐럿 색을 FlowMeet Primary 토큰으로 스코프드 오버라이드
const textFieldPrimaryFocusSx = {
  '&:has(input:focus) [data-role="text-field-wrapper"]': {
    boxShadow:
      'inset 0 0 0 2px color-mix(in srgb, var(--color-primary-40) 43%, transparent) !important',
  },
  '[data-role="text-field-wrapper"] input': {
    caretColor: 'var(--color-primary-40)',
  },
} as const;

interface SearchModalContentProps {
  onResultClick?: (id: string) => void;
}

type SearchResultItem = (typeof EXAMPLE_SEARCH_RESULTS.items)[number];

export const SearchModalContent = ({ onResultClick }: SearchModalContentProps) => {
  const [query, setQuery] = useState('');

  const hasQuery = query.trim().length > 0;

  const results = useMemo<readonly SearchResultItem[]>(
    () => (hasQuery ? EXAMPLE_SEARCH_RESULTS.items : []),
    [hasQuery],
  );

  return (
    <div className="flex h-144 w-full flex-col gap-6">
      {/* 검색 입력 + 결과 카운트 */}
      <div className="flex w-full flex-col gap-3">
        <TextField
          id="project-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="검색어를 입력해 주세요."
          width="100%"
          sx={textFieldPrimaryFocusSx}
          leadingContent={
            <TextFieldContent variant="icon">
              <IconSearchThick className="text-label-alternative h-5 w-5" aria-hidden="true" />
            </TextFieldContent>
          }
        />
        {hasQuery && (
          <p className="text-label-1 text-label-alternative">
            {EXAMPLE_SEARCH_RESULTS.totalCount}개의 검색 결과
          </p>
        )}
      </div>

      {/* 검색 결과 리스트 (남은 영역 스크롤) */}
      {hasQuery && (
        <ul className="flex w-full min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb:hover]:bg-label-alternative/45 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-label-alternative/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 [scrollbar-color:color-mix(in_srgb,var(--color-label-alternative)_20%,transparent)_transparent] [scrollbar-width:thin]">
          {results.map((item) => {
            const isMain = item.nodeType === 'main';
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onResultClick?.(item.id)}
                  className="hover:bg-line-solid-neutral flex w-full items-start gap-2.5 rounded-lg border-none bg-transparent p-4 text-left transition-colors duration-150"
                >
                  {isMain ? (
                    <ContentBadge
                      size="medium"
                      variant="solid"
                      color="accent"
                      className="!bg-primary-40/10 !text-primary-40 shrink-0"
                    >
                      #{item.nodeNumber}
                    </ContentBadge>
                  ) : (
                    <ContentBadge
                      size="medium"
                      variant="outlined"
                      color="neutral"
                      className="shrink-0"
                    >
                      #{item.nodeNumber}
                    </ContentBadge>
                  )}

                  <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-headline-2 text-label-normal truncate font-medium">
                        {item.title}
                      </span>
                      <span className="text-label-1 text-label-assistive shrink-0">
                        최종 편집일: {item.lastEditDate}
                      </span>
                    </div>
                    <p className="text-body-1 text-label-alternative line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

SearchModalContent.displayName = 'SearchModalContent';
