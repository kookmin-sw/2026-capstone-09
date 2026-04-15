'use client';

import Link from 'next/link';
import { useState } from 'react';

import { EXAMPLE_ONLINE_USERS } from '@/constants/exampleConstant';
import { ProjectDetailHeader } from './ProjectDetailHeader';
import { ProjectDetailLinks } from './ProjectDetailLinks';
import type { ProjectViewTypes } from './ProjectViewTabs';

const VIEW_LABELS: Record<ProjectViewTypes, string> = {
  'node-flow': '노드 플로우',
  list: '리스트',
  kanban: '칸반',
};

export const ProjectDetailPageContent = () => {
  const [activeView, setActiveView] = useState<ProjectViewTypes>('node-flow');

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <ProjectDetailHeader
        activeView={activeView}
        onlineUsers={EXAMPLE_ONLINE_USERS}
        onViewChange={setActiveView}
      />
      <ProjectDetailLinks />
      <section className="bg-surface-canvas flex flex-1 flex-col items-center justify-center gap-3 overflow-hidden px-20 py-24">
        <p className="text-body-1 font-medium text-label-neutral">{VIEW_LABELS[activeView]}</p>
        <Link
          href="/projects"
          className="rounded-md border border-line-normal-neutral bg-static-white px-4 py-2 text-title-3 font-medium text-label-normal hover:bg-fill-alternative"
        >
          뒤로가기
        </Link>
      </section>
    </div>
  );
};
