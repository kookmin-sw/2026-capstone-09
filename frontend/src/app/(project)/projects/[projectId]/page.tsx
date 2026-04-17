'use client';

import Link from 'next/link';

import {
  type ProjectViewTypes,
  useProjectDetailLayout,
} from '@/app/(project)/projects/[projectId]/layout';

const VIEW_LABELS: Record<ProjectViewTypes, string> = {
  'node-flow': '노드 플로우',
  list: '리스트',
  kanban: '칸반',
};

export default function ProjectDetailPage() {
  const { activeView } = useProjectDetailLayout();

  return (
    <section className="bg-surface-canvas flex flex-1 flex-col items-center justify-center gap-3 overflow-hidden px-20 py-24">
      <p className="text-body-1 text-label-neutral font-medium">{VIEW_LABELS[activeView]}</p>
      <Link
        href="/projects"
        className="border-line-normal-neutral bg-static-white text-title-3 text-label-normal hover:bg-fill-alternative rounded-md border px-4 py-2 font-medium"
      >
        뒤로가기
      </Link>
    </section>
  );
}
