'use client';

import { IconPlus, IconSparkle } from '@wanteddev/wds-icon';
import Link from 'next/link';
import { useState } from 'react';

import {
  type ProjectViewTypes,
  useProjectDetailLayout,
} from '@/app/(project)/projects/[projectId]/layout';
import type {
  MultiNodeSummaryNode,
  MultiNodeSummaryResult,
} from '@/components/projects/project-detail/multi-node-summary/types';
import { EXAMPLE_MULTI_NODE_SUMMARY_RESULT } from '@/constants/exampleConstant';
import {
  type ProjectDetailActionNode,
  useProjectDetailActions,
} from '@/hooks/useProjectDetailActions';

const EXAMPLE_SUMMARY_NODES: readonly MultiNodeSummaryNode[] = [
  { id: 'summary-node-1', label: '비즈니스 모델 전략 회의' },
  { id: 'summary-node-2', label: 'MVP기능 회의' },
  { id: 'summary-node-3', label: 'MVP 개발 일정 조정 회의' },
  { id: 'summary-node-4', label: 'PPT 제작 회의' },
];

const EXAMPLE_SUMMARY_RESULT: MultiNodeSummaryResult = EXAMPLE_MULTI_NODE_SUMMARY_RESULT;

const VIEW_LABELS: Record<ProjectViewTypes, string> = {
  'node-flow': '노드 플로우',
  list: '리스트',
  kanban: '칸반',
};

const INITIAL_NODE: ProjectDetailActionNode = {
  id: 'demo-node-1',
  badge: '#1',
  title: '디자인 회의일걸요?',
};

export default function ProjectDetailPage() {
  const { activeView } = useProjectDetailLayout();
  const [node, setNode] = useState<ProjectDetailActionNode | null>(INITIAL_NODE);

  const { handleNodeContextMenu, handleOpenMultiNodeSummaryModal, handleOpenMeetingCreateModal } =
    useProjectDetailActions({
      node,
      onNodeDeleted: () => setNode(null),
      summaryNodes: EXAMPLE_SUMMARY_NODES,
      summaryResult: EXAMPLE_SUMMARY_RESULT,
    });

  return (
    <section className="bg-surface-canvas flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-20 py-24">
      <p className="text-body-1 text-label-neutral font-medium">{VIEW_LABELS[activeView]}</p>

      {activeView === 'node-flow' && (
        <>
          {node ? (
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
          )}

          <button
            type="button"
            onClick={handleOpenMeetingCreateModal}
            className="bg-primary-40 text-static-white hover:bg-primary-50 text-body-1 flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold transition-colors"
          >
            <IconPlus className="h-4 w-4" aria-hidden="true" />
            회의 생성
          </button>

          <button
            type="button"
            onClick={handleOpenMultiNodeSummaryModal}
            className="border-line-normal-neutral bg-static-white text-label-normal hover:bg-fill-alternative text-body-1 flex items-center gap-2 rounded-lg border px-4 py-2.5 font-medium transition-colors"
          >
            <IconSparkle className="text-primary-40 h-4 w-4" aria-hidden="true" />
            다중 노드 요약
          </button>
        </>
      )}

      <Link
        href="/projects"
        className="border-line-normal-neutral bg-static-white text-title-3 text-label-normal hover:bg-fill-alternative rounded-md border px-4 py-2 font-medium"
      >
        뒤로가기
      </Link>
    </section>
  );
}
