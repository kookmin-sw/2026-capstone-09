'use client';

import { ContentBadge } from '@wanteddev/wds';

import { cn } from '@/utils/cn';

import type { ReferencedNodeItem } from './useReferenceNodeForm';

interface ReferencedNodesListProps {
  items: readonly ReferencedNodeItem[];
  /** 추가 모드일 때는 외곽 폼 패널과 함께 노출되므로 최대 높이를 좁혀 노출한다. */
  variant?: 'list' | 'add';
}

export const ReferencedNodesList = ({ items, variant = 'list' }: ReferencedNodesListProps) => (
  <section className="flex w-full flex-col gap-2">
    <h3 className="text-label-1 text-label-neutral font-semibold">참조 중인 노드 목록</h3>
    <ul
      className={cn(
        'custom-scrollbar flex w-full flex-col gap-1 overflow-y-auto pr-2',
        variant === 'list' ? 'max-h-95' : 'max-h-72',
      )}
    >
      {items.map((item) => (
        <li
          key={item.edgeId}
          className="bg-fill-alternative/50 flex items-start gap-2 rounded-lg px-4 py-2"
        >
          <ContentBadge
            size="medium"
            variant="solid"
            color="accent"
            className="!bg-primary-40/10 !text-primary-40 shrink-0"
          >
            #{item.number}
          </ContentBadge>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-4">
              <span className="text-body-2 text-label-normal truncate font-medium">
                {item.title}
              </span>
              <span className="text-caption-1 text-label-assistive shrink-0 font-normal">
                연결한 사람: {item.createdBy?.nickname}
              </span>
            </div>
            <p className="text-caption-1 text-label-alternative w-full truncate font-normal">
              {item.comment}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

ReferencedNodesList.displayName = 'ReferencedNodesList';
