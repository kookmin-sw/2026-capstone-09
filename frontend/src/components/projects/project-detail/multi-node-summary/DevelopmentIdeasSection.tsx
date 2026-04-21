'use client';

import type { ParsedIdea } from '@/utils/mermaid';

interface DevelopmentIdeasSectionProps {
  ideas: readonly ParsedIdea[];
}

export const DevelopmentIdeasSection = ({ ideas }: DevelopmentIdeasSectionProps) => {
  return (
    <section className="flex w-full flex-col gap-2">
      <span className="text-label-1 text-label-neutral font-semibold">개선 아이디어</span>
      <ul className="border-label-disable flex flex-col gap-3 rounded-xl border p-3">
        {ideas.map((idea, index) => (
          <li
            key={`${idea.title}-${index}`}
            className="border-line-solid-neutral flex flex-col gap-1.5 rounded-lg border p-3"
          >
            <h4 className="text-label-1 text-label-normal font-semibold">{idea.title}</h4>
            <p className="text-label-1 text-label-alternative whitespace-pre-line">{idea.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

DevelopmentIdeasSection.displayName = 'DevelopmentIdeasSection';
