'use client';

import { TextField, TextFieldContent } from '@wanteddev/wds';
import { IconSearchThick } from '@wanteddev/wds-icon';
import { type ChatSearchResultItem, useChatSearchModalForm } from './useChatSearchModalForm';

interface ChatSearchModalContentProps {
  projectId: number;
  onResultClick?: (item: ChatSearchResultItem) => void;
}

export const ChatSearchModalContent = ({ projectId, onResultClick }: ChatSearchModalContentProps) => {
  const { query, setQuery, results, isLoading, hasError, hasQuery } = useChatSearchModalForm({
    projectId,
  });

  return (
    <div className="flex h-144 w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-3">
        <TextField
          id="chat-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="채팅 제목을 검색해 주세요."
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
            return (
              <li key={item.chatSessionId}>
                <button
                  type="button"
                  onClick={() => onResultClick?.(item)}
                  className="hover:bg-fill-alternative flex w-full items-start gap-2.5 rounded-lg bg-transparent p-4 text-left transition-colors duration-150"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-body-1 text-label-normal min-w-0 flex-1 truncate font-medium">
                      {item.title}
                    </span>
                  </div>
                </button>
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

ChatSearchModalContent.displayName = 'ChatSearchModalContent';