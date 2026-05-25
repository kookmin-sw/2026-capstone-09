'use client';

import { ContentBadge } from '@wanteddev/wds';
import { type RefObject, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { getNodeKind, type ReferenceNodeOption } from './useReferenceNodeForm';

interface ReferenceNodeSearchResultsProps {
  /** 드롭다운의 위치/너비를 잡기 위한 기준 엘리먼트 */
  anchorRef: RefObject<HTMLDivElement | null>;
  results: readonly ReferenceNodeOption[];
  onSelect: (option: ReferenceNodeOption) => void;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

const DROPDOWN_OFFSET = 8;
const VIEWPORT_BOTTOM_MARGIN = 16;
const DROPDOWN_HARD_MAX_HEIGHT = 400;
const DROPDOWN_MIN_HEIGHT = 160;

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const ReferenceNodeSearchResults = ({
  anchorRef,
  results,
  onSelect,
}: ReferenceNodeSearchResultsProps) => {
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  // 모달이 overflow-hidden이라 드롭다운을 portal로 띄우고 anchor 좌표 기준으로 fixed 배치
  useIsomorphicLayoutEffect(() => {
    const updatePosition = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const availableBelow = Math.max(
        DROPDOWN_MIN_HEIGHT,
        viewportHeight - rect.bottom - DROPDOWN_OFFSET - VIEWPORT_BOTTOM_MARGIN,
      );
      setPosition({
        top: rect.bottom + DROPDOWN_OFFSET,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(DROPDOWN_HARD_MAX_HEIGHT, availableBelow),
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, results.length]);

  if (results.length === 0 || !position) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="listbox"
      aria-label="참조할 노드 검색 결과"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: position.maxHeight,
        zIndex: 10000,
      }}
      className="custom-scrollbar border-line-solid-neutral bg-background-elevated-normal flex flex-col overflow-y-auto overscroll-contain rounded-2xl border py-2 shadow-md"
    >
      {results.map((option) => {
        const kind = getNodeKind(option);
        return (
          <button
            key={`${option.nodeId}-${option.nodeNumber}`}
            type="button"
            role="option"
            // 입력에서 onMouseDown(blur 발생) 전에 선택을 처리하기 위해 onMouseDown 사용
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(option);
            }}
            className="bg-background-elevated-normal hover:bg-fill-normal flex w-full items-center gap-2 px-5 py-2 text-left"
          >
            <span className="shrink-0">
              {kind === 'main' ? (
                <ContentBadge
                  size="xsmall"
                  variant="solid"
                  color="accent"
                  className="!bg-primary-40/10 !text-primary-40"
                >
                  #{option.nodeNumber}
                </ContentBadge>
              ) : (
                <ContentBadge size="xsmall" variant="outlined" color="neutral">
                  #{option.nodeNumber}
                </ContentBadge>
              )}
            </span>
            <span className="text-label-1 text-label-normal flex-1 truncate font-normal">
              {option.nodeTitle}
            </span>
          </button>
        );
      })}
    </div>,
    document.body,
  );
};

ReferenceNodeSearchResults.displayName = 'ReferenceNodeSearchResults';
