'use client';

import type { ActionItemsAnalysis } from './types';

interface ActionItemsSectionProps {
  analysis: ActionItemsAnalysis | undefined | null;
}

export const ActionItemsSection = ({ analysis }: ActionItemsSectionProps) => {
  if (!analysis) return null;

  const personEntries = Object.entries(analysis.byPerson ?? {});

  return (
    <section className="flex w-full flex-col gap-2">
      <span className="text-label-1 text-label-neutral font-semibold">액션 아이템 분석</span>
      <div className="border-label-disable flex flex-col gap-4 rounded-xl border p-3">
        <p className="text-body-1 text-label-normal">
          총 <span className="text-primary-40 font-semibold">{analysis.totalCount}</span>개의 액션
          아이템
        </p>
        <ul className="flex flex-col gap-2">
          {personEntries.map(([name, { count, rate }]) => {
            const percent = Math.round((rate ?? 0) * 100);
            return (
              <li key={name} className="flex items-center gap-3">
                <span className="text-label-1 text-label-normal w-16 shrink-0 font-medium">
                  {name}
                </span>
                <div className="bg-fill-normal relative h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-primary-40 absolute inset-y-0 left-0 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-caption-1 text-label-alternative w-20 shrink-0 text-right">
                  {count}개 ({percent}%)
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

ActionItemsSection.displayName = 'ActionItemsSection';
