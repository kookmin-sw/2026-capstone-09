'use client';

import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useCallback, useState, useEffect } from 'react';

import { privateApi } from '@/api';
import { KanbanItem } from '@/api/Api';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { Loading } from '@/components/commons/loading/Loading';
import { NodeSidebar } from '@/components/node-datail/NodeSidebar';

import { useKanbanDragDrop } from './hooks/useKanbanDragDrop';
import { KanbanColumn } from './KanbanColumn';

interface KanbanViewProps {
  projectId: number;
}

const KANBAN_STATUSES = ['WAITING', 'IN_PROGRESS', 'DONE'] as const;
type KanbanStatusType = (typeof KANBAN_STATUSES)[number];

export function KanbanView({ projectId }: KanbanViewProps) {
  const toast = usePositionedToast();
  const [sidebarNodeId, setSidebarNodeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupedNodes, setGroupedNodes] = useState<Record<KanbanStatusType, KanbanItem[]>>({
    WAITING: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  const loadKanbanData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await privateApi.node.getKanban(projectId);
      const chartData = data.data.data ?? null;

      const grouped = {
        WAITING: [...(chartData?.waiting ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        IN_PROGRESS: [...(chartData?.inProgress ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        DONE: [...(chartData?.done ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      };
      setGroupedNodes(grouped);
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

  const { handleDragOver, handleDragEnd } = useKanbanDragDrop({
    groupedNodes,
    setGroupedNodes,
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
      {sidebarNodeId && (
        <NodeSidebar projectId={projectId} nodeId={sidebarNodeId} onClose={() => setSidebarNodeId(null)} />
      )}
    </DndContext>
  );
}