'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { privateApi } from '@/api';
import { GetFlowchartResponse } from '@/api/Api';
import { Loading } from '@/components/commons/loading/Loading';
import { MainNodeConnector } from './MainNodeConnector';
import { NodeBranch } from './NodeBranch';
import NodeButton from './NodeButton';

interface NodeFlowViewProps {
  projectId: number;
}

export function NodeFlowView({ projectId }: NodeFlowViewProps) {
  const [flowChart, setFlowChart] = useState<GetFlowchartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFlowChart = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await privateApi.node.getFlowchart(projectId);
        setFlowChart(data.data.data ?? null);
      } catch (error) {
        console.error('Failed to load flowchart:', error);
        setError(error instanceof Error ? error.message : '플로우차트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    void loadFlowChart();
  }, [projectId]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      const container = containerRef.current;
      container.scrollLeft = 0;
      container.scrollTop = 0;
    }
  }, [loading]);

  const handleNodeClick = useCallback((nodeId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();

      const delta = -e.deltaY;
      const zoomIntensity = 0.01;
      setZoom((prevZoom) => {
        const newZoom = prevZoom + delta * zoomIntensity;
        return Math.min(Math.max(0.1, newZoom), 3);
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[class*="bg-white"]')) {
        setFocusedNodeId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-body-1 text-label-neutral font-medium">
            플로우차트를 불러오는데 실패했습니다
          </p>
          <p className="text-caption-1 text-label-assistive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-40 hover:bg-primary-50 rounded-lg px-4 py-2 text-white transition-colors"
          >
            다시 시도
          </button>
        </div>
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

  const mainNodes = flowChart?.nodes?.filter((node) => !node.parentId) ?? [];
  const subNodes = flowChart?.nodes?.filter((node) => !!node.parentId) ?? [];

  const handleCreateSubNode = async (parentNodeId: number) => {
    if (!flowChart?.nodes) return;

    const parentNode = flowChart.nodes.find((n) => n.nodeId === parentNodeId);
    if (!parentNode) return;

    try {
      const childCount = parentNode.childNodeIds?.length ?? 0;

      await privateApi.node.createNode(projectId, {
        title: `새 서브 노드`,
        type: 'SUB',
        parentId: parentNodeId,
      });

      const data = await privateApi.node.getFlowchart(projectId);
      setFlowChart(data.data.data ?? null);

      if (data.data.data?.nodes) {
        const updatedParent = data.data.data.nodes.find((n) => n.nodeId === parentNodeId);
        const newChildIds = updatedParent?.childNodeIds ?? [];
        if (newChildIds.length > childCount) {
          const newNodeId = newChildIds[newChildIds.length - 1];
          setFocusedNodeId(newNodeId);

          setTimeout(() => {
            const newNodeElement = document.querySelector(`[data-node-id="${newNodeId}"]`);
            if (newNodeElement) {
              newNodeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
              });
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error('Failed to create sub node:', error);
      alert('서브 노드 생성에 실패했습니다.');
    }
  };

  const handleCreateReference = (_startNodeId: number) => {
    // TODO: 참조 노드 선택 모달 열기 또는 API 호출
  };

  const handleDeleteNode = (_nodeId: number) => {
    // TODO: 삭제 확인 모달 열기 → API 호출 → 상태 업데이트
  };

  const handleCreateMainNode = async () => {
    if (!flowChart?.nodes) return;

    try {
      const mainNodesCount = flowChart.nodes.filter((n) => !n.parentId).length;

      await privateApi.node.createNode(projectId, {
        title: `새 메인 노드`,
        type: 'MAIN',
      });

      const data = await privateApi.node.getFlowchart(projectId);
      setFlowChart(data.data.data ?? null);

      if (data.data.data?.nodes) {
        const mainNodes = data.data.data.nodes.filter((n) => !n.parentId);
        if (mainNodes.length > mainNodesCount) {
          const newNode = mainNodes[mainNodes.length - 1];
          if (newNode.nodeId !== undefined) {
            setFocusedNodeId(newNode.nodeId);

            setTimeout(() => {
              const newNodeElement = document.querySelector(`[data-node-id="${newNode.nodeId}"]`);
              if (newNodeElement) {
                newNodeElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                  inline: 'center',
                });
              }
            }, 100);
          }
        }
      }
    } catch (error) {
      console.error('Failed to create main node:', error);
      alert('메인 노드 생성에 실패했습니다.');
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="fixed top-[120px] right-6 z-[60]" onMouseDown={(e) => e.stopPropagation()}>
        <NodeButton
          onAddMainNode={handleCreateMainNode}
          onAddSubNode={focusedNodeId !== null ? () => handleCreateSubNode(focusedNodeId) : undefined}
          onAddMeeting={
            focusedNodeId
              ? () => {
                  /* TODO: 모달 열기 */
                }
              : undefined
          }
        />
      </div>

      <div
        ref={containerRef}
        className="bg-surface-canvas h-full w-full overflow-auto [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <div
          ref={contentRef}
          className="relative inline-block min-h-[200vh] min-w-[200vw] px-20 pt-30 pb-20"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* 메인 노드 연결선 */}
          {mainNodes?.map((mainNode, index) => {
            if (index === mainNodes.length - 1) return null;
            const nextNode = mainNodes[index + 1];
            if (!mainNode.nodeId || !nextNode.nodeId) return null;
            return (
              <MainNodeConnector
                key={`connector-${mainNode.nodeId}-${nextNode.nodeId}`}
                startNodeId={mainNode.nodeId}
                endNodeId={nextNode.nodeId}
                containerRef={contentRef}
                zoom={zoom}
              />
            );
          })}

          <div className="flex flex-col gap-8">
            {/* 노드 트리 */}
            <div className="flex gap-12">
              {mainNodes?.map((mainNode, idx) => {
                const subNodesForMain = subNodes?.filter((sub) =>
                  sub.nodeId !== undefined && mainNode?.childNodeIds?.includes(sub.nodeId),
                );

                return (
                  <NodeBranch
                    key={mainNode.nodeId ?? `main-${idx}`}
                    mainNode={mainNode}
                    subNodes={subNodesForMain ?? []}
                    allNodes={flowChart.nodes ?? []}
                    allEdges={flowChart.edges ?? []}
                    focusedNodeId={focusedNodeId}
                    onNodeClick={handleNodeClick}
                    onCreateSubNode={handleCreateSubNode}
                    onCreateReference={handleCreateReference}
                    onDeleteNode={handleDeleteNode}
                    zoom={zoom}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
