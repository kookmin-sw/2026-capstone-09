'use client';

import { useCallback, useEffect, useState } from 'react';
import { EXAMPLE_FLOWCHART_DATA } from '@/constants/exampleConstant';
import { FlowChart } from '@/types/FlowChartTypes';
import { DashedComment } from './DashedComment';
import { BaseNode } from './BaseNode';

export function NodeFlowView() {
  const [flowChart, setFlowChart] = useState<FlowChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusedNodeId, setFocusedNodeId] = useState<number | null>(null);

  useEffect(() => {
    const loadFlowChart = async () => {
      // TODO: API 호출로 변경
      await new Promise((resolve) => setTimeout(resolve, 100));

      setFlowChart(EXAMPLE_FLOWCHART_DATA);
      setLoading(false);
    };
    loadFlowChart();
  }, []);

  const handleNodeClick = useCallback((nodeId: number) => {
    setFocusedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-body-1 text-label-neutral">로딩 중...</p>
      </div>
    );
  }

  if (!flowChart) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-body-1 text-label-neutral">플로우차트 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 메인 노드, 서브 노드, 점선 엣지 분리
  const mainNodes = flowChart.nodes.filter((node) => node.parentId === null);
  const subNodes = flowChart.nodes.filter((node) => node.parentId !== null);
  const commentEdges = flowChart.edges.filter((edge) => edge.comment);

  return (
    <div className="w-full h-full overflow-auto bg-surface-canvas p-6">
      <div className="flex flex-col gap-8 min-w-max">
        {/* 메인 노드 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-body-1 font-semibold text-neutral-90">메인 노드</h2>
          <div className="flex gap-4">
            {mainNodes.map((node) => (
              <BaseNode
                key={node.nodeId}
                node={node}
                variant="main"
                isFocused={focusedNodeId === node.nodeId}
                onNodeClick={handleNodeClick}
              />
            ))}
          </div>
        </div>

        {/* 서브 노드 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-body-1 font-semibold text-neutral-90">서브 노드</h2>
          <div className="flex flex-wrap gap-4">
            {subNodes.map((node) => (
              <BaseNode
                key={node.nodeId}
                node={node}
                variant="sub"
                isFocused={focusedNodeId === node.nodeId}
                onNodeClick={handleNodeClick}
              />
            ))}
          </div>
        </div>

        {/* 점선 코멘트 - Default */}
        <div className="flex flex-col gap-4">
          <h2 className="text-body-1 font-semibold text-neutral-90">점선 코멘트 (Default)</h2>
          <div className="flex gap-4">
            {commentEdges.map((edge) => (
              <DashedComment key={edge.edgeId} edge={edge} isCreateMode={false} />
            ))}
          </div>
        </div>

        {/* 점선 코멘트 - Create */}
        <div className="flex flex-col gap-4">
          <h2 className="text-body-1 font-semibold text-neutral-90">점선 코멘트 (Create)</h2>
          <div className="flex gap-4">
            <DashedComment isCreateMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
}