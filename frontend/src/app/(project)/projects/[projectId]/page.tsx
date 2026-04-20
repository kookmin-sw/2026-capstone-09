'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  type ProjectViewTypes,
  useProjectDetailLayout,
} from '@/app/(project)/projects/[projectId]/layout';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { NodeDeleteConfirmContent } from '@/components/projects/project-detail/NodeDeleteConfirmContent';

const VIEW_LABELS: Record<ProjectViewTypes, string> = {
  'node-flow': '노드 플로우',
  list: '리스트',
  kanban: '칸반',
};

interface DemoNode {
  id: string;
  badge: string;
  title: string;
}

const INITIAL_NODE: DemoNode = {
  id: 'demo-node-1',
  badge: '#1.1',
  title: '디자인 회의일걸요?',
};

export default function ProjectDetailPage() {
  const { activeView } = useProjectDetailLayout();
  const { openDialog, closeDialog } = useDialog();
  const [node, setNode] = useState<DemoNode | null>(INITIAL_NODE);

  const handleNodeContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!node) return;
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <NodeDeleteConfirmContent
          nodeName={node.title}
          onConfirm={() => {
            closeDialog();
            setNode(null);
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  return (
    <section className="bg-surface-canvas flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-20 py-24">
      <p className="text-body-1 text-label-neutral font-medium">{VIEW_LABELS[activeView]}</p>

      {activeView === 'node-flow' &&
        (node ? (
          <button
            type="button"
            onContextMenu={handleNodeContextMenu}
            className="border-line-normal-neutral bg-static-white hover:bg-fill-alternative text-label-normal flex items-center gap-2 rounded-lg border px-4 py-2.5"
          >
            <span className="text-primary-40 text-caption-1 font-medium">{node.badge}</span>
            <span className="text-body-1 font-medium">{node.title}</span>
          </button>
        ) : (
          <p className="text-caption-1 text-label-alternative">노드가 삭제되었어요.</p>
        ))}

      <Link
        href="/projects"
        className="border-line-normal-neutral bg-static-white text-title-3 text-label-normal hover:bg-fill-alternative rounded-md border px-4 py-2 font-medium"
      >
        뒤로가기
      </Link>
    </section>
  );
}
