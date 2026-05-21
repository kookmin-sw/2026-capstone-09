import { useState, useCallback } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, useNodes, useReactFlow, Position } from 'reactflow';
import type { Edge as FlowChartEdge } from '@/types/FlowChartTypes';
import { DashedComment } from './DashedComment';

/**
 * 참조 관계를 위한 점선 edge + DashedComment
 * React Flow의 getBezierPath를 활용하여 두 개의 곡선으로 구성
 */
export function ReferenceEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const edgeData = data?.edgeData as FlowChartEdge | undefined;
  const onDeleteEdgeFn = data?.onDeleteEdge as
    | ((edgeId: number, startNodeId: number, endNodeId: number) => void)
    | undefined;
  const nodes = useNodes();
  const { screenToFlowPosition } = useReactFlow();
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleEdgeClick = () => {
    if (onDeleteEdgeFn && edgeData) {
      onDeleteEdgeFn(edgeData.edgeId, edgeData.startNodeId, edgeData.endNodeId);
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      setMousePos(pos);
    },
    [screenToFlowPosition],
  );

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // 노드들과 겹치지 않는 위치 찾기
  const NODE_WIDTH = 280;
  const NODE_HEIGHT = 120;
  const COMMENT_WIDTH = 250;
  const COMMENT_HEIGHT = 90;
  const MIN_OFFSET = 120;
  const OFFSET_STEP = 80;

  function isOverlapping(x: number, y: number): boolean {
    return nodes.some((node) => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;

      // 코멘트 박스와 노드가 겹치는지 확인
      return (
        x - COMMENT_WIDTH / 2 < nodeX + NODE_WIDTH &&
        x + COMMENT_WIDTH / 2 > nodeX &&
        y - COMMENT_HEIGHT / 2 < nodeY + NODE_HEIGHT &&
        y + COMMENT_HEIGHT / 2 > nodeY
      );
    });
  }

  // 여러 위치를 시도 (아래 → 위 → 더 아래 → 더 위)
  let referenceNodeX = midX;
  let referenceNodeY = midY + MIN_OFFSET;

  const positions = [
    { x: midX, y: midY + MIN_OFFSET },           // 아래
    { x: midX, y: midY - MIN_OFFSET },           // 위
    { x: midX, y: midY + MIN_OFFSET + OFFSET_STEP }, // 더 아래
    { x: midX, y: midY - MIN_OFFSET - OFFSET_STEP }, // 더 위
    { x: midX, y: midY + MIN_OFFSET + OFFSET_STEP * 2 }, // 훨씬 아래
  ];

  for (const pos of positions) {
    if (!isOverlapping(pos.x, pos.y)) {
      referenceNodeX = pos.x;
      referenceNodeY = pos.y;
      break;
    }
  }

  const getOppositePosition = (pos: Position) => {
    if (pos === Position.Left) return Position.Right;
    if (pos === Position.Right) return Position.Left;
    if (pos === Position.Top) return Position.Bottom;
    return Position.Top;
  };

  const [path1] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: referenceNodeX,
    targetY: referenceNodeY,
    targetPosition: getOppositePosition(sourcePosition),
    curvature: 0.25,
  });

  const [path2] = getBezierPath({
    sourceX: referenceNodeX,
    sourceY: referenceNodeY,
    sourcePosition: getOppositePosition(targetPosition),
    targetX,
    targetY,
    targetPosition,
    curvature: 0.25,
  });

  const commentX = mousePos?.x ?? referenceNodeX;
  const commentY = mousePos?.y ?? referenceNodeY;

  const sharedHoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => { setHovered(false); setMousePos(null); },
    onMouseMove: handleMouseMove,
  };

  return (
    <>
      {/* 첫 번째 점선: 시작 노드 → 참조노드 (시각) */}
      <path
        d={path1}
        fill="none"
        style={{
          stroke: hovered ? 'var(--color-primary-40)' : 'var(--color-primary-50)',
          strokeWidth: 1,
          strokeDasharray: '5,5',
          transition: 'stroke 0.15s',
        }}
      />
      {/* 두 번째 점선: 참조노드 → 끝 노드 (시각) */}
      <path
        d={path2}
        fill="none"
        style={{
          stroke: hovered ? 'var(--color-primary-40)' : 'var(--color-primary-50)',
          strokeWidth: 1,
          strokeDasharray: '5,5',
          transition: 'stroke 0.15s',
        }}
      />
      {/* 투명 히트영역: path1 클릭/호버/마우스 감지 */}
      <path
        d={path1}
        fill="none"
        style={{ stroke: 'transparent', strokeWidth: 14, cursor: 'pointer' }}
        onClick={handleEdgeClick}
        {...sharedHoverProps}
      />
      {/* 투명 히트영역: path2 클릭/호버/마우스 감지 */}
      <path
        d={path2}
        fill="none"
        style={{ stroke: 'transparent', strokeWidth: 14, cursor: 'pointer' }}
        onClick={handleEdgeClick}
        {...sharedHoverProps}
      />

      {edgeData && hovered && mousePos && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -120%) translate(${commentX}px,${commentY}px)`,
              pointerEvents: 'none',
              zIndex: 10001,
            }}
            className="nodrag nopan"
          >
            <DashedComment edge={edgeData} />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}