'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { privateApi } from '@/api';
import { KanbanItem } from '@/api/Api';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { Loading } from '@/components/commons/loading/Loading';
import { NodeSidebar } from '@/components/node-datail/NodeSidebar';
import { NodeStatusType } from '@/constants/nodeStatus';

import { KanbanColumn } from './KanbanColumn';

interface KanbanViewProps {
  projectId: number;
}

const KANBAN_STATUSES: NodeStatusType[] = ['WAITING', 'IN_PROGRESS', 'DONE'];

export function KanbanView({ projectId }: KanbanViewProps) {
  const toast = usePositionedToast();
  const [loading, setLoading] = useState(true);
  const [groupedNodes, setGroupedNodes] = useState<Record<NodeStatusType, KanbanItem[]>>({
    WAITING: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const [sidebarNodeId, setSidebarNodeId] = useState<number | null>(null);

  const groupedNodesRef = useRef(groupedNodes);

  useEffect(() => {
    groupedNodesRef.current = groupedNodes;
  }, [groupedNodes]);

  // 8px 이상 움직였을 때만 드래그 시작
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const loadKanbanData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await privateApi.node.getKanban(projectId);
      const chartData = data.data.data ?? null;
      setGroupedNodes({
        WAITING: (chartData?.waiting ?? []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        IN_PROGRESS: (chartData?.inProgress ?? []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        DONE: (chartData?.done ?? []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      });
    } catch (error) {
      console.error('Failed to load kanban:', error);
      const errorMessage =
        error instanceof Error ? error.message : '칸반 데이터를 불러오는데 실패했습니다.';
      toast({
        content: errorMessage,
        variant: 'negative',
        placement: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    void loadKanbanData();
  }, [loadKanbanData]);

  const handleNodeDoubleClick = useCallback((nodeId: number) => {
    setSidebarNodeId(nodeId);
  }, []);

  const findNodeStatus = useCallback(
    (nodeId: number, nodes: Record<NodeStatusType, KanbanItem[]>): NodeStatusType | null => {
      for (const status of ['WAITING', 'IN_PROGRESS', 'DONE'] as NodeStatusType[]) {
        if (nodes[status].some((n) => n.nodeId === nodeId)) {
          return status;
        }
      }
      return null;
    },
    []
  );

  const updateNodePosition = useCallback(
    (activeId: number, overId: string | number) => {
      setGroupedNodes((prev) => {
        const activeStatus = findNodeStatus(activeId, prev);
        if (!activeStatus) return prev;

        const isOverColumn = ['WAITING', 'IN_PROGRESS', 'DONE'].includes(overId as string);
        const overStatus = isOverColumn ? (overId as NodeStatusType) : findNodeStatus(Number(overId), prev);

        if (!overStatus) return prev;

        // 같은 컬럼 내에서 이동
        if (activeStatus === overStatus) {
          if (isOverColumn) {
            return prev; // 같은 컬럼으로 드롭하면 무시
          }

          const oldIndex = prev[activeStatus].findIndex((n) => n.nodeId === activeId);
          const newIndex = prev[overStatus].findIndex((n) => n.nodeId === Number(overId));

          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
            return prev;
          }

          return {
            ...prev,
            [activeStatus]: arrayMove(prev[activeStatus], oldIndex, newIndex),
          };
        } else {
          // 다른 컬럼으로 이동
          const activeNode = prev[activeStatus].find((n) => n.nodeId === activeId);
          if (!activeNode) return prev;

          const sourceNodes = prev[activeStatus].filter((n) => n.nodeId !== activeId);
          const destNodes = [...prev[overStatus]];

          let insertIndex: number;
          if (isOverColumn) {
            insertIndex = destNodes.length;
          } else {
            insertIndex = destNodes.findIndex((n) => n.nodeId === Number(overId));
            // insertIndex가 -1이면 마지막에 추가
            if (insertIndex === -1) {
              insertIndex = destNodes.length;
            }
          }

          destNodes.splice(insertIndex, 0, activeNode);

          return {
            ...prev,
            [activeStatus]: sourceNodes,
            [overStatus]: destNodes,
          };
        }
      });
    },
    [findNodeStatus]
  );

  // 0ms 디바운스로 무한 루프 방지 (dnd-kit sortable 이슈)
  const debouncedUpdateNodePosition = useDebouncedCallback(updateNodePosition, 0);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeId = Number(active.id);
      const overId = over.id;

      debouncedUpdateNodePosition(activeId, overId);
    },
    [debouncedUpdateNodePosition]
  );

  // 드래그 종료 후 서버 저장
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      const nodeId = Number(active.id);
      const currentNodes = groupedNodesRef.current;
      const targetStatus = findNodeStatus(nodeId, currentNodes);

      if (!targetStatus) return;

      try {
        const nodes = currentNodes[targetStatus];
        const nodeIndex = nodes.findIndex((n) => n.nodeId === nodeId);

        // sortOrder 계산
        let newSortOrder: number;

        if (nodeIndex === 0) {
          // 첫 번째 위치
          const nextNode = nodes[1];
          newSortOrder = nextNode ? (nextNode.sortOrder ?? 1024) / 2 : 512;
        } else if (nodeIndex === nodes.length - 1) {
          // 마지막 위치
          const prevNode = nodes[nodeIndex - 1];
          newSortOrder = (prevNode?.sortOrder ?? 0) + 1024;
        } else {
          // 중간 위치
          const prevNode = nodes[nodeIndex - 1];
          const nextNode = nodes[nodeIndex + 1];
          newSortOrder = ((prevNode?.sortOrder ?? 0) + (nextNode?.sortOrder ?? 0)) / 2;
        }

        await privateApi.node.updateNodeKanban(projectId, nodeId, {
          status: targetStatus,
          sortOrder: newSortOrder,
        });
      } catch (error) {
        console.error('Failed to update node status:', error);
        toast({
          content: '노드 상태 변경에 실패했습니다.',
          variant: 'negative',
          placement: 'top-center',
        });
        await loadKanbanData();
      }
    },
    [findNodeStatus, loadKanbanData, projectId, toast]
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex-1 h-full w-full p-10 bg-surface-canvas">
        <div className="flex gap-2.5 h-full">
          {KANBAN_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              nodes={groupedNodes[status]}
              onNodeDoubleClick={handleNodeDoubleClick}
            />
          ))}
        </div>
      </div>

      <NodeSidebar projectId={projectId} nodeId={sidebarNodeId} onClose={() => setSidebarNodeId(null)} />
    </DndContext>
  );
}