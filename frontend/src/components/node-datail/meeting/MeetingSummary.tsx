'use client';

import { MermaidDiagram } from '@/components/commons/mermaid/MermaidDiagram';

interface MeetingSummaryProps {
  summary: string;
  mermaidCode?: string;
}

export function MeetingSummary({ summary, mermaidCode }: MeetingSummaryProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-heading-5 text-label-normal">회의 요약</p>
        <p className="text-body-1-reading text-label-alternative whitespace-pre-wrap">{summary}</p>
      </div>
      {mermaidCode && (
        <div className="flex flex-col gap-2">
          <p className="text-heading-5 text-label-normal">회의 흐름</p>
          <MermaidDiagram code={mermaidCode} />
        </div>
      )}
    </div>
  );
}