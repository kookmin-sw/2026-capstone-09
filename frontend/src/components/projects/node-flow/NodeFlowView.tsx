'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loading } from '@/components/commons/loading/Loading';
import { EXAMPLE_FLOWCHART_DATA } from '@/constants/exampleConstant';
import { FlowChart } from '@/types/FlowChartTypes';
import { BaseNode } from './BaseNode';
import { DashedComment } from './DashedComment';

export function NodeFlowView() {
  const [flowChart, setFlowChart] = useState<FlowChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusedNodeId, setFocusedNodeId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFlowChart = async () => {
      try {
        // TODO: API 호출로 변경
        await new Promise((resolve) => setTimeout(resolve, 100));
        setFlowChart(EXAMPLE_FLOWCHART_DATA);
      } catch (error) {
        console.error('Failed to load flowchart:', error);
      } finally {
        setLoading(false);
      }
    };
    void loadFlowChart();
  }, []);

  const handleNodeClick = useCallback((nodeId: number) => {
    setFocusedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX + (containerRef.current?.scrollLeft || 0),
      y: e.clientY + (containerRef.current?.scrollTop || 0),
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const dx = dragStart.x - e.clientX;
    const dy = dragStart.y - e.clientY;

    containerRef.current.scrollLeft = dx;
    containerRef.current.scrollTop = dy;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (!flowChart) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-body-1 text-label-neutral">플로우차트 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const mainNodes = flowChart.nodes.filter((node) => node.parentId === null);
  const subNodes = flowChart.nodes.filter((node) => node.parentId !== null);
  const commentEdges = flowChart.edges.filter((edge) => edge.comment);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-surface-canvas p-6 [&::-webkit-scrollbar]:hidden"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
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
          <div className="flex flex-col flex-wrap gap-4">
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