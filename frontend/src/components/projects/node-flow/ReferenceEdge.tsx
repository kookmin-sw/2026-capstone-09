import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, Position } from 'reactflow';
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

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  const referenceNodeOffsetY = 100;
  const referenceNodeX = midX;
  const referenceNodeY = midY + referenceNodeOffsetY;

  const [path1] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: referenceNodeX,
    targetY: referenceNodeY,
    targetPosition: Position.Left, // 참조노드의 왼쪽으로 연결
  });

  const [path2] = getBezierPath({
    sourceX: referenceNodeX,
    sourceY: referenceNodeY,
    sourcePosition: Position.Right, // 참조노드의 오른쪽에서 시작
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* 첫 번째 점선: 시작 노드 → 참조노드 */}
      <BaseEdge
        id={`${id}-1`}
        path={path1}
        style={{
          stroke: 'var(--color-primary-50)',
          strokeWidth: 1,
          strokeDasharray: '5,5',
        }}
      />

      {/* 두 번째 점선: 참조노드 → 끝 노드 */}
      <BaseEdge
        id={`${id}-2`}
        path={path2}
        style={{
          stroke: 'var(--color-primary-50)',
          strokeWidth: 1,
          strokeDasharray: '5,5',
        }}
      />

      {edgeData && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${referenceNodeX}px,${referenceNodeY}px)`,
              pointerEvents: 'all',
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