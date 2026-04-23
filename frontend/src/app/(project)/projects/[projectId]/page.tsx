'use client';

import { NodeFlowView } from '@/components/projects/node-flow/NodeFlowView';
import { useProjectDetailLayout } from '@/contexts/ProjectDetailLayoutContext';

export default function ProjectDetailPage() {
  const { activeView } = useProjectDetailLayout();

  return (
    <section className="bg-surface-canvas flex flex-1 flex-col overflow-hidden">
      {activeView === 'node-flow' && (
        <div className="flex-1 w-full h-full">
          <NodeFlowView />
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
