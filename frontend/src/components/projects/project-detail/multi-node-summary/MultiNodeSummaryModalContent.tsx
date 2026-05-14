'use client';

import { IconClose, IconDownload } from '@wanteddev/wds-icon';
import { useMemo, useRef } from 'react';

import { buildMermaidCode, parseDevelopmentIdeas } from '@/utils/mermaid';

import { ActionItemsSection } from './ActionItemsSection';
import { DevelopmentIdeasSection } from './DevelopmentIdeasSection';
import { MeetingRelationshipsSection } from './MeetingRelationshipsSection';
import { ReferenceNodesSection } from './ReferenceNodesSection';
import { RelationDiagramSection } from './RelationDiagramSection';
import type { MultiNodeSummaryNode, MultiNodeSummaryResult } from './types';
import { useSummaryPdfDownload } from './useSummaryPdfDownload';

interface MultiNodeSummaryModalContentProps {
  nodes: readonly MultiNodeSummaryNode[];
  result: MultiNodeSummaryResult;
  onDownloadClick?: () => void;
  onClose: () => void;
}

export const MultiNodeSummaryModalContent = ({
  nodes,
  result,
  onDownloadClick,
  onClose,
}: MultiNodeSummaryModalContentProps) => {
  const pdfAreaRef = useRef<HTMLDivElement>(null);
  const { isDownloading, handleDownloadClick } = useSummaryPdfDownload({
    areaRef: pdfAreaRef,
    onDownloaded: onDownloadClick,
  });

  const ideas = useMemo(
    () => parseDevelopmentIdeas(result.developmentIdeas),
    [result.developmentIdeas],
  );
  const diagramCode = useMemo(
    () => result.mermaidCode ?? buildMermaidCode(result.meetingRelationships),
    [result.mermaidCode, result.meetingRelationships],
  );

  return (
    <>
      {isDownloading && (
        <div
          className="bg-static-white/80 fixed inset-0 z-[10000] flex items-center justify-center backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="border-primary-40 inline-block h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            <span className="text-body-1 text-label-normal font-medium">PDF를 준비하고 있어요</span>
          </div>
        </div>
      )}
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-1 text-label-normal font-medium">AI 다중 노드 요약</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadClick}
              disabled={isDownloading}
              aria-label="요약 PDF 다운로드"
              className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-50"
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

        <div
          ref={pdfAreaRef}
          className="custom-scrollbar flex max-h-150 w-full flex-col gap-6 overflow-y-auto pr-2"
        >
          <ReferenceNodesSection nodes={nodes} />
          <ActionItemsSection analysis={result.actionItemsAnalysis} />
          <MeetingRelationshipsSection relationships={result.meetingRelationships} />
          <DevelopmentIdeasSection ideas={ideas} />
          <RelationDiagramSection code={diagramCode} />
        </div>
      </div>
    </>
  );
};

MultiNodeSummaryModalContent.displayName = 'MultiNodeSummaryModalContent';
