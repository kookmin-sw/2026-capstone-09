'use client';

import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useCallback, useState, useEffect, useMemo } from 'react';

import { privateApi } from '@/api';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { Loading } from '@/components/commons/loading/Loading';
import { NodeSidebar } from '@/components/node-datail/NodeSidebar';
import { useKanbanQuery } from '@/queries/node';

import { useKanbanDragDrop } from './hooks/useKanbanDragDrop';
import { KanbanColumn } from './KanbanColumn';

interface KanbanViewProps {
  projectId: number;
}

const KANBAN_STATUSES = ['WAITING', 'IN_PROGRESS', 'DONE'] as const;

export function KanbanView({ projectId }: KanbanViewProps) {
  const toast = usePositionedToast();
  const [sidebarNodeId, setSidebarNodeId] = useState<number | null>(null);
  const { data: kanbanData, isFetching: loading } = useKanbanQuery(projectId);

  const groupedNodes = useMemo(() => {
    if (!kanbanData) {
      return { WAITING: [], IN_PROGRESS: [], DONE: [] };
    }
    return {
      WAITING: [...(kanbanData.waiting ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      IN_PROGRESS: [...(kanbanData.inProgress ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      DONE: [...(kanbanData.done ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    };
  }, [kanbanData]);

  const [localGroupedNodes, setLocalGroupedNodes] = useState(groupedNodes);

  useEffect(() => {
    setLocalGroupedNodes(groupedNodes);
  }, [groupedNodes]);

  const loadKanbanData = useCallback(async () => {
    try {
      const data = await privateApi.node.getKanban(projectId);
      const chartData = data.data.data ?? null;

      const grouped = {
        WAITING: [...(chartData?.waiting ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        IN_PROGRESS: [...(chartData?.inProgress ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        DONE: [...(chartData?.done ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      };
      setLocalGroupedNodes(grouped);
    } catch (error) {
      console.error('Failed to load kanban:', error);
      const errorMessage =
        error instanceof Error ? error.message : '칸반 데이터를 불러오는데 실패했습니다.';
      toast({
        content: errorMessage,
        variant: 'negative',
        placement: 'top-center',
      });
    }
  }, [projectId, toast]);

  const { handleDragOver, handleDragEnd } = useKanbanDragDrop({
    groupedNodes: localGroupedNodes,
    setGroupedNodes: setLocalGroupedNodes,
    projectId,
    loadKanbanData,
  });

  const handleNodeDoubleClick = useCallback((nodeId: number) => {
    setSidebarNodeId(nodeId);
  }, []);

  // 8px 이상 움직였을 때만 드래그 시작
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      autoScroll={{ threshold: { x: 0, y: 0.2 } }}
    >
      <div className="bg-surface-canvas h-full w-full flex-1 overflow-hidden p-10">
        <div className="flex h-full gap-2.5 overflow-hidden">
          {KANBAN_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              nodes={localGroupedNodes[status]}
              onNodeDoubleClick={handleNodeDoubleClick}
            />
          ))}
        </div>
      </div>
      {sidebarNodeId && (
        <NodeSidebar projectId={projectId} nodeId={sidebarNodeId} onClose={() => setSidebarNodeId(null)} />
      )}
    </DndContext>
  );
}
