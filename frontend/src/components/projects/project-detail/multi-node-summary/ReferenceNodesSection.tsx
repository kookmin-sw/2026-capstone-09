'use client';

import { Chip } from '@wanteddev/wds';

import type { MultiNodeSummaryNode } from './types';

interface ReferenceNodesSectionProps {
  nodes: readonly MultiNodeSummaryNode[] | undefined | null;
}

export const ReferenceNodesSection = ({ nodes }: ReferenceNodesSectionProps) => {
  if (!nodes) return null;

  return (
    <section className="flex w-full flex-col gap-2">
      <span className="text-label-1 text-label-neutral font-semibold">참조 노드</span>
      <div className="border-line-normal-neutral shadow-normal-xsmall flex min-h-12 w-full flex-wrap items-center gap-3 rounded-xl border px-3 py-2">
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
    </section>
  );
};

ReferenceNodesSection.displayName = 'ReferenceNodesSection';
