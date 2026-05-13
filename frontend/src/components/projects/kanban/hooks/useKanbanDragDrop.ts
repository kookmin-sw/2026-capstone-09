import { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { privateApi } from '@/api';
import { KanbanItem } from '@/api/Api';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';

const KANBAN_STATUSES = ['WAITING', 'IN_PROGRESS', 'DONE'] as const;
type KanbanStatusType = (typeof KANBAN_STATUSES)[number];

const SORT_ORDER_GAP = 1024;

interface UseKanbanDragDropParams {
  groupedNodes: Record<KanbanStatusType, KanbanItem[]>;
  setGroupedNodes: React.Dispatch<React.SetStateAction<Record<KanbanStatusType, KanbanItem[]>>>;
  projectId: number;
  loadKanbanData: () => Promise<void>;
}

export function useKanbanDragDrop({
  groupedNodes,
  setGroupedNodes,
  projectId,
  loadKanbanData,
}: UseKanbanDragDropParams) {
  const toast = usePositionedToast();
  const groupedNodesRef = useRef(groupedNodes);

  useEffect(() => {
    groupedNodesRef.current = groupedNodes;
  }, [groupedNodes]);

  const findNodeStatus = useCallback(
    (nodeId: number, nodes: Record<KanbanStatusType, KanbanItem[]>): KanbanStatusType | null => {
      for (const status of KANBAN_STATUSES) {
        if (nodes[status].some((n) => n.nodeId === nodeId)) {
          return status;
        }
      }
      return null;
    },
    []
  );

  const calculateSortOrder = useCallback(
    (nodes: KanbanItem[], nodeIndex: number, isNodeInArray: boolean) => {
      let newSortOrder: number;
      let needsRebalance = false;

      if (nodeIndex === 0) {
        // 첫 번째 위치
        const nextNode = isNodeInArray ? nodes[1] : nodes[0];
        const nextOrder = nextNode?.sortOrder ?? SORT_ORDER_GAP;
        newSortOrder = nextOrder / 2;

        if (newSortOrder < 1) {
          needsRebalance = true;
        }
      } else if (nodeIndex === nodes.length - (isNodeInArray ? 1 : 0)) {
        // 마지막 위치
        const prevNode = nodes[nodeIndex - 1];
        newSortOrder = (prevNode?.sortOrder ?? 0) + SORT_ORDER_GAP;
      } else {
        // 중간 위치
        const prevNode = nodes[nodeIndex - 1];
        const nextNode = isNodeInArray ? nodes[nodeIndex + 1] : nodes[nodeIndex];
        const prevOrder = prevNode?.sortOrder ?? 0;
        const nextOrder = nextNode?.sortOrder ?? 0;
        newSortOrder = (prevOrder + nextOrder) / 2;

        const gap = Math.abs(newSortOrder - prevOrder);
        if (gap < 1) {
          needsRebalance = true;
        }
      }
      return { newSortOrder, needsRebalance };
    },
    []
  );

  const updateNodePosition = useCallback(
    (activeId: number, overId: string | number) => {
      setGroupedNodes((prev) => {
        const activeStatus = findNodeStatus(activeId, prev);
        if (!activeStatus) return prev;

        const isOverColumn = KANBAN_STATUSES.includes(overId as KanbanStatusType);
        const overStatus = isOverColumn ? (overId as KanbanStatusType) : findNodeStatus(Number(overId), prev);

        if (!overStatus) return prev;

        // 같은 컬럼 내에서 이동
        if (activeStatus === overStatus) {
          if (isOverColumn) {
            return prev;
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
    [findNodeStatus, setGroupedNodes]
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

      if (!over) return;

      const nodeId = Number(active.id);
      const currentNodes = groupedNodesRef.current;

      // 현재 시각적 위치에서 노드 찾기 (handleDragOver로 이미 이동된 상태)
      const currentStatus = findNodeStatus(nodeId, currentNodes);
      if (!currentStatus) return;

      const allNodes = currentNodes[currentStatus];

      try {
        // 현재 시각적 위치에서 인덱스 찾기
        const currentIndex = allNodes.findIndex((n) => n.nodeId === nodeId);
        if (currentIndex === -1) return;

        // 현재 위치 기준으로 sortOrder 계산
        const { newSortOrder: calculatedSortOrder, needsRebalance } = calculateSortOrder(allNodes, currentIndex, true);
        let newSortOrder = calculatedSortOrder;

        if (needsRebalance) {
          // 리밸런싱
          const rebalanced = allNodes.map((node, index) => ({
            ...node,
            sortOrder: (index + 1) * SORT_ORDER_GAP,
          }));

          setGroupedNodes((prev) => ({
            ...prev,
            [currentStatus]: rebalanced,
          }));

          newSortOrder = (currentIndex + 1) * SORT_ORDER_GAP;

          // 리밸런싱 시 전체 노드를 서버에 업데이트
          await Promise.all(
            rebalanced.map((node) =>
              privateApi.node.updateNodeKanban(projectId, node.nodeId ?? 0, {
                status: currentStatus,
                sortOrder: node.sortOrder ?? 0,
              })
            )
          );
        } else {
          // sortOrder만 업데이트
          const updated = allNodes.map((node) =>
            node.nodeId === nodeId ? { ...node, sortOrder: newSortOrder } : node
          );

          setGroupedNodes((prev) => ({
            ...prev,
            [currentStatus]: updated,
          }));

          // 서버에 이동한 노드만 저장
          await privateApi.node.updateNodeKanban(projectId, nodeId, {
            status: currentStatus,
            sortOrder: newSortOrder,
          });
        }
      } catch (error) {
        console.error('Failed to update node status:', error);
        const errorMessage =
          error instanceof Error ? error.message : '노드 상태 변경에 실패했습니다.';
        toast({
          content: errorMessage,
          variant: 'negative',
          placement: 'top-center',
        });
        await loadKanbanData();
      }
    },
    [calculateSortOrder, findNodeStatus, loadKanbanData, projectId, setGroupedNodes, toast]
  );

  return {
    handleDragOver,
    handleDragEnd,
  };
}