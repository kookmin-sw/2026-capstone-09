'use client';

import { ContentBadge } from '@wanteddev/wds';
import { IconArrowRight } from '@wanteddev/wds-icon';

import type { MeetingRelationship } from './types';

interface MeetingRelationshipsSectionProps {
  relationships: readonly MeetingRelationship[];
}

export const MeetingRelationshipsSection = ({
  relationships,
}: MeetingRelationshipsSectionProps) => {
  return (
    <section className="flex w-full flex-col gap-2">
      <span className="text-label-1 text-label-neutral font-semibold">회의 관계</span>
      <ul className="border-label-disable flex flex-col gap-3 rounded-xl border p-3">
        {relationships.map((rel, index) => (
          <li
            key={`${rel.from}-${rel.to}-${index}`}
            className="border-line-solid-neutral flex flex-col gap-1.5 rounded-lg border p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-label-1 text-label-normal font-medium">{rel.from}</span>
              <IconArrowRight className="text-label-alternative h-4 w-4" aria-hidden="true" />
              <span className="text-label-1 text-label-normal font-medium">{rel.to}</span>
              <ContentBadge
                size="xsmall"
                variant="solid"
                color="accent"
                className="!bg-primary-40/10 !text-primary-40"
              >
                {rel.relation}
              </ContentBadge>
            </div>
            <p className="text-label-1 text-label-alternative">{rel.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

MeetingRelationshipsSection.displayName = 'MeetingRelationshipsSection';
