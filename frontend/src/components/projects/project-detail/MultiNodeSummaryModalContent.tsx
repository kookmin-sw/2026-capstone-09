'use client';

import { Chip } from '@wanteddev/wds';
import { IconClose, IconDownload } from '@wanteddev/wds-icon';

export interface MultiNodeSummaryNode {
  id: string;
  label: string;
}

interface MultiNodeSummaryModalContentProps {
  nodes: readonly MultiNodeSummaryNode[];
  summary: string;
  onDownloadClick?: () => void;
  onClose: () => void;
}

export const MultiNodeSummaryModalContent = ({
  nodes,
  summary,
  onDownloadClick,
  onClose,
}: MultiNodeSummaryModalContentProps) => {
  return (
    <div className="flex w-full flex-col gap-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading-1 text-label-normal font-medium">AI 다중 노드 요약</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDownloadClick}
            aria-label="요약 다운로드"
            className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
          >
            <IconDownload className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
          >
            <IconClose className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 참조 노드 */}
      <div className="flex w-full flex-col gap-2">
        <span className="text-label-1 text-label-neutral font-semibold">참조 노드</span>
        <div className="border-line-normal-neutral flex min-h-12 w-full flex-wrap items-center gap-3 rounded-xl border px-3 py-2 [box-shadow:0_1px_2px_-1px_rgba(23,23,23,0.10)]">
          {nodes.length === 0 ? (
            <span className="text-body-1 text-label-assistive">참조된 노드가 없어요.</span>
          ) : (
            nodes.map((node) => (
              <Chip key={node.id} size="medium" variant="solid" color="neutral" disableInteraction>
                <span className="text-caption-1 text-label-alternative font-medium">
                  {node.label}
                </span>
              </Chip>
            ))
          )}
        </div>
      </div>

      {/* AI 요약 */}
      <div className="flex w-full flex-col gap-2">
        <span className="text-label-1 text-label-neutral font-semibold">AI 요약</span>
        <div className="border-label-disable rounded-xl border p-3">
          <p className="text-label-1 text-label-normal whitespace-pre-line">{summary}</p>
        </div>
      </div>
    </div>
  );
};

MultiNodeSummaryModalContent.displayName = 'MultiNodeSummaryModalContent';
