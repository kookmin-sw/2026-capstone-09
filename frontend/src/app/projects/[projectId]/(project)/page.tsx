'use client';

import { use } from 'react';
import { NodeFlowView } from '@/components/projects/node-flow/NodeFlowView';
import { useProjectDetailLayout } from '@/contexts/ProjectDetailLayoutContext';

interface ProjectDetailPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { activeView } = useProjectDetailLayout();
  const { projectId } = use(params);
  const projectIdNum = parseInt(projectId, 10);

  return (
    <section className="bg-surface-canvas flex flex-1 flex-col overflow-hidden">
      {activeView === 'node-flow' && (
        <div className="h-full w-full flex-1">
          <NodeFlowView projectId={projectIdNum} />
        </div>
      )}
      {activeView === 'list' && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-1 text-label-neutral font-medium">리스트 뷰</p>
        </div>
      )}
      {activeView === 'kanban' && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-1 text-label-neutral font-medium">칸반 뷰</p>
        </div>
      )}
    </section>
  );
}
