import { Node, Edge, MarkerType } from 'reactflow';
import { GetFlowchartResponse, NodeItem } from '@/api/Api';

export interface FlowchartNode extends Node {
  data: NodeItem & {
    isMainNode: boolean;
  };
}

/**
 * API 응답(GetFlowchartResponse)을 React Flow 형식으로 변환
 */
export function convertToReactFlow(flowchart: GetFlowchartResponse | null): {
  nodes: FlowchartNode[];
  edges: Edge[];
} {
  if (!flowchart || !flowchart.nodes) {
    return { nodes: [], edges: [] };
  }

  const MAIN_NODE_GAP = 100; // 메인 노드끼리의 가로 간격
  const DEPTH1_GAP_Y = 200; // depth 1 세로 간격
  const DEPTH2_GAP_X = 300; // depth 2 이상 가로 간격
  const DEPTH2_GAP_Y = 200; // depth 2 이상 세로 간격
  const NODE_WIDTH = 280; // 노드 기본 너비

  const nodes: FlowchartNode[] = [];
  const edges: Edge[] = [];

  const nodeMap = new Map<number, NodeItem>();
  flowchart.nodes.forEach((node) => {
    if (node.nodeId) {
      nodeMap.set(node.nodeId, node);
    }
  });

  // 메인 노드 찾기
  const mainNodes = flowchart.nodes.filter((node) => !node.parentId);

  // 각 메인 노드별 depth 1 자식들의 Y 위치
  const depth1YPositions = new Map<number, number>();

  // 각 메인 노드별 현재 사용 중인 최대 Y 위치
  const currentMaxYPositions = new Map<number, number>();

  // 트리의 최대 depth 계산
  function getMaxDepth(node: NodeItem, currentDepth: number = 0): number {
    if (!node.childNodeIds || node.childNodeIds.length === 0) {
      return currentDepth;
    }
    let maxChildDepth = currentDepth;
    node.childNodeIds.forEach((childId) => {
      const childNode = nodeMap.get(childId);
      if (childNode) {
        maxChildDepth = Math.max(maxChildDepth, getMaxDepth(childNode, currentDepth + 1));
      }
    });
    return maxChildDepth;
  }

  // 각 메인 노드의 필요한 너비 계산
  const mainNodeWidths: number[] = [];
  mainNodes.forEach((mainNode) => {
    const maxDepth = getMaxDepth(mainNode);
    // depth 2부터 가로로 확장되므로
    const horizontalExpansion = maxDepth >= 2 ? (maxDepth - 1) * DEPTH2_GAP_X : 0;
    mainNodeWidths.push(NODE_WIDTH + horizontalExpansion);
  });

  // 각 메인 노드의 X 시작 위치 계산
  const mainNodeXPositions: number[] = [];
  let currentX = 0;
  mainNodeWidths.forEach((width) => {
    mainNodeXPositions.push(currentX);
    currentX += width + MAIN_NODE_GAP;
  });

  function placeNodeAndChildren(
    node: NodeItem,
    mainIndex: number,
    depth: number,
    parentX: number,
    parentY: number,
    siblingIndex: number = 0
  ) {
    const isMain = depth === 0;
    let x: number;
    let y: number;

    if (isMain) {
      // depth 0: 메인 노드는 계산된 X 위치에 배치
      x = mainNodeXPositions[mainIndex] ?? 0;
      y = 0;
    } else if (depth === 1) {
      // depth 1: 메인 노드의 서브 노드 세로로 배치 (오른쪽으로 40px)
      x = parentX + 40;
      const minY = depth1YPositions.get(mainIndex) ?? DEPTH1_GAP_Y;
      const currentMaxY = currentMaxYPositions.get(mainIndex) ?? 0;

      // 이전 서브 노드들이 차지한 공간을 고려하여 배치
      y = Math.max(minY, currentMaxY + DEPTH1_GAP_Y);

      depth1YPositions.set(mainIndex, y + DEPTH1_GAP_Y);
      // depth 1 노드도 최대 Y 위치 업데이트
      currentMaxYPositions.set(mainIndex, Math.max(currentMaxYPositions.get(mainIndex) ?? 0, y));
    } else {
      // depth 2 이상
      x = parentX + DEPTH2_GAP_X;

      if (siblingIndex === 0) {
        // 첫 번째 서브 노드: 부모와 같은 Y
        y = parentY;
      } else {
        // 두 번째 이후: 아래로 배치
        const currentMaxY = currentMaxYPositions.get(mainIndex) ?? 0;
        y = currentMaxY + DEPTH2_GAP_Y;
      }
      currentMaxYPositions.set(mainIndex, Math.max(currentMaxYPositions.get(mainIndex) ?? 0, y));
    }

    // 노드 추가
    nodes.push({
      id: String(node.nodeId),
      type: isMain ? 'mainNode' : 'subNode',
      position: { x, y },
      data: {
        ...node,
        isMainNode: isMain,
      },
    });

    if (node.childNodeIds && node.childNodeIds.length > 0) {
      node.childNodeIds.forEach((childId, childIndex) => {
        const childNode = nodeMap.get(childId);
        if (childNode) {
          const isParentMain = depth === 0;
          const isFirstChild = childIndex === 0;

          let sourceHandle: string;
          let targetHandle: string;

          if (isParentMain) {
            // 메인 노드 → 모든 서브 노드
            sourceHandle = 'child-source';
            targetHandle = 'target';
          } else {
            // 서브 노드 → 서브 노드
            if (isFirstChild) {
              // 첫 번째 서브 노드: 오른쪽에서 왼쪽으로
              sourceHandle = 'source';
              targetHandle = 'target';
            } else {
              // 두 번째 이후: 오른쪽에서 왼쪽으로
              sourceHandle = 'source';
              targetHandle = 'target';
            }
          }

          edges.push({
            id: `parent-${node.nodeId}-${childId}`,
            source: String(node.nodeId),
            target: String(childId),
            type: 'step',
            sourceHandle,
            targetHandle,
            style: { stroke: '#E5E7EB', strokeWidth: 2 },
          });

          placeNodeAndChildren(childNode, mainIndex, depth + 1, x, y, childIndex);
        }
      });
    }
  }

  // 각 메인 노드와 서브 노드 배치
  mainNodes.forEach((mainNode, mainIndex) => {
    placeNodeAndChildren(mainNode, mainIndex, 0, 0, 0, 0);

    // 메인 노드 간 연결
    if (mainIndex < mainNodes.length - 1) {
      const nextNode = mainNodes[mainIndex + 1];
      edges.push({
        id: `main-${mainNode.nodeId}-${nextNode.nodeId}`,
        source: String(mainNode.nodeId),
        target: String(nextNode.nodeId),
        type: 'straight',
        sourceHandle: 'main-source', // 오른쪽 중앙
        targetHandle: 'main-target', // 왼쪽 중앙
        markerEnd: { type: MarkerType.Arrow },
        style: { stroke: 'var(--color-label-assistive)', strokeWidth: 2 },
      });
    }
  });

  if (flowchart.edges) {
    flowchart.edges.forEach((edge) => {
      if (edge.startNodeId && edge.endNodeId) {
        const startNode = nodeMap.get(edge.startNodeId);
        const endNode = nodeMap.get(edge.endNodeId);

        // 메인 노드가 포함되어 있는지 확인
        const isStartMain = startNode && !startNode.parentId;
        const isEndMain = endNode && !endNode.parentId;
        const hasMainNode = isStartMain || isEndMain;

        edges.push({
          id: `edge-${edge.edgeId}`,
          source: String(edge.startNodeId),
          target: String(edge.endNodeId),
          type: 'reference',
          // 메인 노드 포함: ref handle 사용 (왼쪽→오른쪽)
          // 서브 노드끼리: 일반 handle 사용 (오른쪽→왼쪽)
          sourceHandle: hasMainNode ? 'ref-source' : 'source',
          targetHandle: hasMainNode ? 'ref-target' : 'target',
          data: { edgeData: edge },
        });
      }
    });
  }

  return { nodes, edges };
}

/**
 * 새로운 노드를 추가한 후 위치 재계산
 * (convertToReactFlow와 동일한 로직 사용)
 */
export function recalculatePositions(
  nodes: FlowchartNode[],
  apiNodes: NodeItem[]
): FlowchartNode[] {
  // convertToReactFlow 로직 재사용
  const result = convertToReactFlow({ nodes: apiNodes, edges: [] });
  return result.nodes;
}