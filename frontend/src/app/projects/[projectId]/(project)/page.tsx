'use client';

import { use } from 'react';
import { ListView } from '@/components/projects/list/ListView';
import { KanbanView } from '@/components/projects/kanban/KanbanView';
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
        <div className="flex-1 w-full h-full">
          <ListView projectId={projectIdNum} />
        </div>
      )}
      {activeView === 'kanban' && (
        <div className="flex-1 w-full h-full">
          <KanbanView projectId={projectIdNum} />
        </div>
      )}
    </section>
  );
}
