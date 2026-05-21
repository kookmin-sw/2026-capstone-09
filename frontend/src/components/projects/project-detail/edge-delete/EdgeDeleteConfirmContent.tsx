'use client';

import { ContentBadge } from '@wanteddev/wds';

import { cn } from '@/utils/cn';

export interface EdgeNodeInfo {
  number: string;
  title: string;
}

interface EdgeDeleteConfirmContentProps {
  fromNode?: EdgeNodeInfo;
  toNode?: EdgeNodeInfo;
  onConfirm: () => void;
  onClose: () => void;
}

export const EdgeDeleteConfirmContent = ({
  fromNode,
  toNode,
  onConfirm,
  onClose,
}: EdgeDeleteConfirmContentProps) => (
  <div className="flex w-90 flex-col gap-4 pb-2">
    <h3 className="text-headline-1 text-label-normal font-semibold">참조 연결을 삭제하시겠어요?</h3>

    {fromNode && toNode && (
      <div className="bg-fill-alternative flex flex-col gap-2 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-caption-1 text-label-assistive w-14 shrink-0 font-medium">시작 노드</span>
          <ContentBadge size="xsmall" variant="solid" color="accent" className="!bg-primary-40/10 !text-primary-40 shrink-0">
            #{fromNode.number}
          </ContentBadge>
          <span className="text-body-2 text-label-normal min-w-0 truncate font-medium">{fromNode.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption-1 text-label-assistive w-14 shrink-0 font-medium">도착 노드</span>
          <ContentBadge size="xsmall" variant="solid" color="accent" className="!bg-primary-40/10 !text-primary-40 shrink-0">
            #{toNode.number}
          </ContentBadge>
          <span className="text-body-2 text-label-normal min-w-0 truncate font-medium">{toNode.title}</span>
        </div>
      </div>
    )}

    <p className="text-body-2 text-label-alternative">참조 연결을 삭제하면 복구할 수 없어요.</p>

    <div className="flex items-center justify-end gap-6 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="text-body-1 text-label-alternative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        취소
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className={cn(
          'text-body-1 rounded-md px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-40',
          'text-status-negative hover:bg-fill-normal active:bg-fill-strong bg-transparent',
        )}
      >
        삭제
      </button>
    </div>
  </div>
);

EdgeDeleteConfirmContent.displayName = 'EdgeDeleteConfirmContent';
