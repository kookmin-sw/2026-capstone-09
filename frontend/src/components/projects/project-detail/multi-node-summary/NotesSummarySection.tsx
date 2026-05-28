'use client';

interface NotesSummarySectionProps {
  summary: string | undefined | null;
}

export const NotesSummarySection = ({ summary }: NotesSummarySectionProps) => {
  if (!summary) return null;

  return (
    <section className="flex w-full flex-col gap-2">
      <span className="text-label-1 text-label-neutral font-semibold">노트 요약</span>
      <div className="border-label-disable rounded-xl border p-3">
        <p className="text-label-1 text-label-normal whitespace-pre-line">{summary}</p>
      </div>
    </section>
  );
};

NotesSummarySection.displayName = 'NotesSummarySection';
