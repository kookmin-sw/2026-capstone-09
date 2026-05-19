'use client';

import { MermaidDiagram } from '@/components/commons/mermaid/MermaidDiagram';

interface RelationDiagramSectionProps {
  code: string;
}

export const RelationDiagramSection = ({ code }: RelationDiagramSectionProps) => {
  return (
    <section className="flex w-full flex-col gap-2">
      <span className="text-label-1 text-label-neutral font-semibold">관계 다이어그램</span>
      <div className="bg-background-normal-alternative border-label-disable overflow-x-auto rounded-xl border p-3">
        <MermaidDiagram code={code} />
      </div>
    </section>
  );
};

RelationDiagramSection.displayName = 'RelationDiagramSection';
