'use client';

import { Button, ContentBadge, TextField, TextFieldContent } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { useEffect, useRef } from 'react';
import { Controller } from 'react-hook-form';

import { ReferenceNodeSearchResults } from './ReferenceNodeSearchResults';
import { getNodeKind, type useReferenceNodeForm } from './useReferenceNodeForm';

type ReferenceNodeFormReturn = ReturnType<typeof useReferenceNodeForm>;

interface ReferenceNodeAddFormProps {
  form: ReferenceNodeFormReturn;
  onCancel: () => void;
}

export const ReferenceNodeAddForm = ({ form, onCancel }: ReferenceNodeAddFormProps) => {
  const {
    control,
    commentLength,
    maxCommentLength,
    canCreate,
    isSearchOpen,
    setIsSearchOpen,
    searchResults,
    selectNodeOption,
    selectedNode,
    clearSelectedNode,
  } = form;

  const keywordWrapperRef = useRef<HTMLDivElement>(null);

  // Portal로 그려진 드롭다운을 클릭한 경우는 닫지 않고, 외부 클릭일 때만 닫는다.
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (keywordWrapperRef.current?.contains(target)) return;
      const dropdown = document.querySelector('[aria-label="참조할 노드 검색 결과"]');
      if (dropdown?.contains(target)) return;
      setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, setIsSearchOpen]);

  return (
    <section className="border-line-normal-neutral flex w-full flex-col gap-4 rounded-xl border p-6">
      <div className="flex w-full flex-col gap-4">
        <Controller
          control={control}
          name="nodeKeyword"
          rules={{ required: true }}
          render={({ field }) => (
            <div ref={keywordWrapperRef} className="relative flex w-full flex-col gap-2">
              <label
                htmlFor="reference-node-keyword"
                className="text-label-1 text-label-neutral font-semibold"
              >
                노드 추가
              </label>
              <TextField
                id="reference-node-keyword"
                value={field.value}
                onChange={(event) => {
                  // 직접 타이핑하면 기존 선택은 무효화 (배지 제거)
                  if (selectedNode) clearSelectedNode();
                  field.onChange(event);
                  if (!isSearchOpen) setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="참조하려는 노드 이름을 입력해 주세요."
                width="100%"
                autoComplete="off"
                leadingContent={
                  selectedNode ? (
                    <TextFieldContent variant="badge">
                      {getNodeKind(selectedNode) === 'main' ? (
                        <ContentBadge
                          size="xsmall"
                          variant="solid"
                          color="accent"
                          className="!bg-primary-40/10 !text-primary-40"
                        >
                          #{selectedNode.nodeNumber}
                        </ContentBadge>
                      ) : (
                        <ContentBadge size="xsmall" variant="outlined" color="neutral">
                          #{selectedNode.nodeNumber}
                        </ContentBadge>
                      )}
                    </TextFieldContent>
                  ) : undefined
                }
                trailingContent={
                  selectedNode ? (
                    <TextFieldContent variant="icon-button">
                      <button
                        type="button"
                        onClick={clearSelectedNode}
                        aria-label="선택한 노드 지우기"
                        className="text-label-alternative hover:text-label-neutral flex h-5 w-5 items-center justify-center border-none bg-transparent p-0"
                      >
                        <IconClose className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </TextFieldContent>
                  ) : undefined
                }
              />
              {isSearchOpen && (
                <ReferenceNodeSearchResults
                  anchorRef={keywordWrapperRef}
                  results={searchResults}
                  onSelect={selectNodeOption}
                />
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="comment"
          render={({ field }) => (
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="reference-node-comment"
                className="text-label-1 text-label-neutral font-semibold"
              >
                코멘트
              </label>
              <TextField
                id="reference-node-comment"
                value={field.value}
                onChange={field.onChange}
                placeholder="코멘트를 입력해 주세요."
                width="100%"
                maxLength={maxCommentLength}
                trailingContent={
                  <TextFieldContent variant="text">
                    {commentLength}/{maxCommentLength}
                  </TextFieldContent>
                }
              />
            </div>
          )}
        />
      </div>

      <div className="flex w-full items-center gap-3">
        <Button
          type="button"
          variant="solid"
          color="assistive"
          size="medium"
          fullWidth
          onClick={onCancel}
        >
          취소
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          size="medium"
          fullWidth
          disabled={!canCreate}
        >
          노드 추가
        </Button>
      </div>
    </section>
  );
};

ReferenceNodeAddForm.displayName = 'ReferenceNodeAddForm';
