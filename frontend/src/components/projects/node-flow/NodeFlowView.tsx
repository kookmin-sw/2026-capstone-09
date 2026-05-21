'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactFlow, {
  Node,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  SelectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { privateApi } from '@/api';
import { GetFlowchartResponse } from '@/api/Api';
import { Loading } from '@/components/commons/loading/Loading';
import { useModal } from '@/components/commons/modal/ModalContext';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import type { EdgeNodeInfo } from '@/components/projects/project-detail/edge-delete/EdgeDeleteConfirmContent';
import { NodeSidebar } from '@/components/node-datail/NodeSidebar';
import { MultiNodeSummaryModalContent } from '@/components/projects/project-detail/multi-node-summary/MultiNodeSummaryModalContent';
import type { MultiNodeSummaryNode, MultiNodeSummaryResult } from '@/components/projects/project-detail/multi-node-summary/types';
import { useMultiNodeSummaryRequest } from '@/components/projects/project-detail/multi-node-summary/useMultiNodeSummaryRequest';
import { EdgeDeleteConfirmContent } from '@/components/projects/project-detail/edge-delete/EdgeDeleteConfirmContent';
import { nodeKeys } from '@/queries/keys/nodeKeys';
import { useDeleteEdgeMutation } from '@/queries/edge';
import { useFlowchartQuery } from '@/queries/node';
import { useErrorToast } from '@/hooks/useErrorToast';
import { convertToReactFlow } from '@/utils/flowchartToReactFlow';
import { CustomNode } from './CustomNode';
import { NodeButton } from './NodeButton';
import { ReferenceEdge } from './ReferenceEdge';

interface NodeFlowViewProps {
  projectId: number;
}

const nodeTypes: NodeTypes = {
  mainNode: CustomNode,
  subNode: CustomNode,
};

const edgeTypes: EdgeTypes = {
  reference: ReferenceEdge,
};

// AI 다중 노드 요약 모달 래퍼 컴포넌트
function ConnectedMultiNodeSummary({
  projectId,
  nodes,
  onClose,
}: {
  projectId: number;
  nodes: readonly MultiNodeSummaryNode[];
  onClose: () => void;
}) {
  const { handleSubmit, isPending } = useMultiNodeSummaryRequest({ projectId, nodes });
  const [result, setResult] = useState<MultiNodeSummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void handleSubmit()
      .then((data) => setResult(data))
      .catch(() => setError('요약을 불러오는데 실패했습니다.'));
  }, [handleSubmit]);

  if (isPending || !result) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-4 text-center">{error}</div>;
  }

  return <MultiNodeSummaryModalContent nodes={nodes} result={result} onClose={onClose} />;
}

function NodeFlowContent({ projectId }: NodeFlowViewProps) {
  const { setViewport, getViewport } = useReactFlow();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModal();
  const { openDialog, closeDialog } = useDialog();
  const showErrorToast = useErrorToast();
  const { mutate: deleteEdge } = useDeleteEdgeMutation(projectId);
  const { data: flowChart, isLoading: loading } = useFlowchartQuery(projectId);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [sidebarNodeId, setSidebarNodeId] = useState<number | null>(null);
  const [showDashedLines, setShowDashedLines] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // localStorage에서 점선 표시 상태 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('showDashedLines');
    if (saved !== null) {
      queueMicrotask(() => {
        setShowDashedLines(JSON.parse(saved));
      });
    }
  }, []);

  // 점선 토글 상태를 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('showDashedLines', JSON.stringify(showDashedLines));
  }, [showDashedLines]);

  // 알림 클릭으로 넘어온 openNode param 처리
  useEffect(() => {
    const openNodeParam = searchParams.get('openNode');
    if (!openNodeParam) return;
    const nodeId = parseInt(openNodeParam, 10);
    if (!Number.isNaN(nodeId)) {
      setSidebarNodeId(nodeId);
      // 파라미터 제거 (히스토리 오염 없이)
      router.replace(`/projects/${projectId}`);
    }
  }, [searchParams, projectId, router]);

  // 쿼리 데이터가 바뀌면 ReactFlow 상태 동기화
  useEffect(() => {
    if (!flowChart) return;
    const { nodes: convertedNodes, edges: convertedEdges } = convertToReactFlow(flowChart);
    setNodes(convertedNodes);
    setEdges(convertedEdges);
  }, [flowChart, setNodes, setEdges]);

  // 노드 단일 클릭 - 선택/해제만
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const nodeId = parseInt(node.id, 10);
      const newSelectedId = selectedNodeId === nodeId ? null : nodeId;
      setSelectedNodeId(newSelectedId);
    },
    [selectedNodeId]
  );

  // 노드 더블 클릭 - 사이드바 열기
  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const nodeId = parseInt(node.id, 10);
    setSidebarNodeId(nodeId);
  }, []);

  // 노드 선택 핸들러 (메뉴에서 사용)
  const handleSelectNode = useCallback((nodeId: number) => {
    setSelectedNodeId(nodeId);
  }, []);

  // 다중 선택 핸들러
  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    setSelectedNodes(selectedNodes);
  }, []);

  // AI 요약 모달 열기
  const handleAISummary = useCallback(() => {
    const summaryNodes: MultiNodeSummaryNode[] = selectedNodes.map((node) => ({
      id: parseInt(node.id, 10),
      label: node.data?.title || `노드 ${node.id}`,
    }));

    openModal({
      closeOnBackdrop: true,
      content: (
        <ConnectedMultiNodeSummary
          projectId={projectId}
          nodes={summaryNodes}
          onClose={closeModal}
        />
      ),
    });
  }, [selectedNodes, projectId, openModal, closeModal]);

  // 플로우 업데이트 및 새 노드로 뷰 이동
  const updateFlowAndMoveToNode = useCallback(
    (chartData: GetFlowchartResponse, newNodeId: number) => {
      const { nodes: convertedNodes, edges: convertedEdges } = convertToReactFlow(chartData);
      setNodes(convertedNodes);
      setEdges(convertedEdges);
      setSelectedNodeId(newNodeId);

      // 새 노드로 뷰 이동 (왼쪽 위에 배치, 현재 zoom 유지)
      setTimeout(() => {
        const newFlowNode = convertedNodes.find((n) => n.id === String(newNodeId));
        if (newFlowNode) {
          const currentViewport = getViewport();
          const leftPadding = 320;
          const topPadding = 300;

          setViewport(
            {
              x: leftPadding - newFlowNode.position.x * currentViewport.zoom,
              y: topPadding - newFlowNode.position.y * currentViewport.zoom,
              zoom: currentViewport.zoom,
            },
            { duration: 800 }
          );
        }
      }, 100);
    },
    [setNodes, setEdges, setSelectedNodeId, getViewport, setViewport]
  );

  // 서브 노드 생성
  const handleCreateSubNode = useCallback(
    async (parentNodeId: number) => {
      if (!flowChart?.nodes || isCreating) return;

      const parentNode = flowChart.nodes.find((n) => n.nodeId === parentNodeId);
      if (!parentNode) return;

      try {
        setIsCreating(true);
        await privateApi.node.createNode(projectId, {
          title: '새 서브 노드',
          type: 'SUB',
          parentId: parentNodeId,
        });
        const data = await privateApi.node.getFlowchart(projectId);
        const chartData = data.data.data ?? null;

        queryClient.setQueryData(nodeKeys.flowchart(projectId), chartData);

        if (chartData) {
          const newNodes = chartData.nodes?.filter((n) => n.parentId === parentNodeId) ?? [];
          const newNode = newNodes[newNodes.length - 1];
          if (newNode?.nodeId) {
            updateFlowAndMoveToNode(chartData, newNode.nodeId);
          }
        }
      } catch (error) {
        console.error('Failed to create sub node:', error);
      } finally {
        setIsCreating(false);
      }
    },
    [flowChart, updateFlowAndMoveToNode, projectId, isCreating, queryClient]
  );

  // 메인 노드 생성
  const handleCreateMainNode = useCallback(async () => {
    if (!flowChart?.nodes || isCreating) return;

    try {
      setIsCreating(true);
      await privateApi.node.createNode(projectId, {
        title: '새 메인 노드',
        type: 'MAIN',
      });
      const data = await privateApi.node.getFlowchart(projectId);
      const chartData = data.data.data ?? null;

      queryClient.setQueryData(nodeKeys.flowchart(projectId), chartData);

      if (chartData) {
        const mainNodes = chartData.nodes?.filter((n) => !n.parentId) ?? [];
        const newNode = mainNodes[mainNodes.length - 1];
        if (newNode?.nodeId) {
          updateFlowAndMoveToNode(chartData, newNode.nodeId);
        }
      }
    } catch (error) {
      console.error('Failed to create main node:', error);
    } finally {
      setIsCreating(false);
    }
  }, [flowChart, updateFlowAndMoveToNode, projectId, isCreating, queryClient]);

  // 노드 정보 조회 헬퍼
  const findNodeInfo = useCallback(
    (nodeId: number): EdgeNodeInfo | undefined => {
      const flowNode = nodes.find((n) => n.id === String(nodeId));
      if (!flowNode) return undefined;
      return {
        number: String(flowNode.data?.number ?? nodeId),
        title: String(flowNode.data?.title ?? ''),
      };
    },
    [nodes],
  );

  // 점선(참조 엣지) 삭제 핸들러
  const handleDeleteEdge = useCallback(
    (edgeId: number, fromNode?: EdgeNodeInfo, toNode?: EdgeNodeInfo) => {
      openDialog({
        closeOnBackdrop: true,
        closeOnEsc: true,
        content: (
          <EdgeDeleteConfirmContent
            fromNode={fromNode}
            toNode={toNode}
            onConfirm={() => {
              deleteEdge(edgeId, {
                onSuccess: () => {
                  closeDialog();
                  void queryClient.invalidateQueries({ queryKey: nodeKeys.flowchart(projectId) });
                },
                onError: (err) => showErrorToast(err, '참조 연결 삭제에 실패했어요.'),
              });
            }}
            onClose={closeDialog}
          />
        ),
      });
    },
    [openDialog, closeDialog, deleteEdge, projectId, queryClient, showErrorToast],
  );

  const edgesWithHandlers = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          onDeleteEdge: (edgeId: number, startNodeId: number, endNodeId: number) =>
            handleDeleteEdge(edgeId, findNodeInfo(startNodeId), findNodeInfo(endNodeId)),
        },
      })),
    [edges, handleDeleteEdge, findNodeInfo],
  );

  const nodesWithHandlers = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        projectId,
        onCreateSubNode: handleCreateSubNode,
        onSelectNode: handleSelectNode,
      },
    }));
  }, [nodes, handleCreateSubNode, handleSelectNode, projectId]);

  const visibleEdges = useMemo(() => {
    if (showDashedLines) {
      return edgesWithHandlers;
    }
    return edgesWithHandlers.filter((edge) => edge.type !== 'reference');
  }, [edgesWithHandlers, showDashedLines]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative h-full w-full" style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodesWithHandlers}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        panOnDrag={false}
        panOnScroll={true}
        panOnScrollSpeed={1}
        zoomOnScroll={false}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        fitView={false}
        minZoom={0.1}
        maxZoom={3}
        defaultViewport={{ x: 80, y: 100, zoom: 1 }}
        className="bg-surface-canvas"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E5E7EB" />
        <Controls showInteractive={false} />

        {/* 노드 생성 버튼 */}
        <Panel position="top-right">
          <NodeButton
            onAddMainNode={() => void handleCreateMainNode()}
            onAddSubNode={
              selectedNodeId !== null ? () => void handleCreateSubNode(selectedNodeId) : undefined
            }
            onAddMeeting={
              selectedNodeId
                ? () => {
                    /* TODO: 모달 열기 */
                  }
                : undefined
            }
            onAISummary={selectedNodes.length > 1 ? handleAISummary : undefined}
            showDashedLines={showDashedLines}
            onToggleDashedLines={setShowDashedLines}
            isCreating={isCreating}
          />
        </Panel>
      </ReactFlow>

      <NodeSidebar projectId={projectId} nodeId={sidebarNodeId} onClose={() => setSidebarNodeId(null)} />
    </div>
  );
}

export function NodeFlowView({ projectId }: NodeFlowViewProps) {
  return (
    <ReactFlowProvider>
      <NodeFlowContent projectId={projectId} />
    </ReactFlowProvider>
  );
}