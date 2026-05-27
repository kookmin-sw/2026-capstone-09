import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EdgeLabelRenderer,
  EdgeProps,
  type Node as FlowNode,
  Position,
  useReactFlow,
  useStore,
} from 'reactflow';
import type { Edge as FlowChartEdge } from '@/types/FlowChartTypes';
import { DashedComment } from './DashedComment';
import { useEdgeHover } from './EdgeHoverContext';

const EDGE_COLOR = 'var(--color-neutral-70)';
const EDGE_COLOR_HOVER = 'var(--color-primary-40)';
const EDGE_OPACITY = 0.5;
const EDGE_OPACITY_HOVER = 1;
const EDGE_CURVE_RATIO = 0.32;
const EDGE_BEND_RATIO = 0.18;
const EDGE_MIN_BEND = 64;
const EDGE_MAX_BEND = 180;

interface Point {
  x: number;
  y: number;
}

interface Rect {
  width: number;
  height: number;
  cx: number;
  cy: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function getNodeRect(node: FlowNode): Rect {
  const x = node.positionAbsolute?.x ?? node.position.x;
  const y = node.positionAbsolute?.y ?? node.position.y;
  const width = node.width ?? 0;
  const height = node.height ?? 0;

  return {
    width,
    height,
    cx: x + width / 2,
    cy: y + height / 2,
    left: x,
    right: x + width,
    top: y,
    bottom: y + height,
  };
}

function getNodeIntersection(node: Rect, towards: Rect): Point {
  const w = node.width / 2;
  const h = node.height / 2;
  const x2 = node.cx;
  const y2 = node.cy;
  const x1 = towards.cx;
  const y1 = towards.cy;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;

  return { x: w * (xx3 + yy3) + x2, y: h * (-xx3 + yy3) + y2 };
}

function getEdgePosition(rect: Rect, point: Point): Position {
  if (Math.round(point.x) <= Math.round(rect.left) + 1) return Position.Left;
  if (Math.round(point.x) >= Math.round(rect.right) - 1) return Position.Right;
  if (Math.round(point.y) <= Math.round(rect.top) + 1) return Position.Top;
  if (Math.round(point.y) >= Math.round(rect.bottom) - 1) return Position.Bottom;
  return Position.Top;
}

function getBendSign(sourcePosition: Position, targetPosition: Position): number {
  if (sourcePosition === Position.Top || targetPosition === Position.Top) return -1;
  if (sourcePosition === Position.Bottom || targetPosition === Position.Bottom) return 1;
  return sourcePosition === Position.Left ? -1 : 1;
}

function getCubicPoint(
  start: Point,
  control1: Point,
  control2: Point,
  end: Point,
  t: number,
): Point {
  const mt = 1 - t;
  const x =
    mt * mt * mt * start.x +
    3 * mt * mt * t * control1.x +
    3 * mt * t * t * control2.x +
    t * t * t * end.x;
  const y =
    mt * mt * mt * start.y +
    3 * mt * mt * t * control1.y +
    3 * mt * t * t * control2.y +
    t * t * t * end.y;

  return { x, y };
}

function getStraightControlPoint(point: Point, position: Position, offset: number): Point {
  if (position === Position.Left) return { x: point.x - offset, y: point.y };
  if (position === Position.Right) return { x: point.x + offset, y: point.y };
  if (position === Position.Top) return { x: point.x, y: point.y - offset };
  return { x: point.x, y: point.y + offset };
}

function getReferencePath({
  source,
  target,
  sourcePosition,
  targetPosition,
}: {
  source: Point;
  target: Point;
  sourcePosition: Position;
  targetPosition: Position;
}) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.hypot(dx, dy) || 1;
  const curveOffset = Math.min(
    Math.max(distance * EDGE_CURVE_RATIO, EDGE_MIN_BEND),
    EDGE_MAX_BEND,
  );
  const bendOffset = Math.min(Math.max(distance * EDGE_BEND_RATIO, EDGE_MIN_BEND), EDGE_MAX_BEND);
  const normal = {
    x: -dy / distance,
    y: dx / distance,
  };
  const bendSign = getBendSign(sourcePosition, targetPosition);

  const control1 = {
    x: source.x + dx * EDGE_CURVE_RATIO + normal.x * bendOffset * bendSign,
    y: source.y + dy * EDGE_CURVE_RATIO + normal.y * bendOffset * bendSign,
  };
  const control2 = getStraightControlPoint(target, targetPosition, curveOffset);
  const label = getCubicPoint(source, control1, control2, target, 0.5);

  return {
    path: `M ${source.x},${source.y} C ${control1.x},${control1.y} ${control2.x},${control2.y} ${target.x},${target.y}`,
    labelX: label.x,
    labelY: label.y,
    control1,
    control2,
  };
}

export function ReferenceEdge({
  id,
  source,
  target,
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
  const { screenToFlowPosition } = useReactFlow();
  const { setHighlightedNodes } = useEdgeHover();
  const sourceNode = useStore(useCallback((s) => s.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((s) => s.nodeInternals.get(target), [target]));
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState<Point | null>(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    return () => {
      if (hoveredRef.current) setHighlightedNodes(null);
    };
  }, [setHighlightedNodes]);

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

  const handleMouseEnter = () => {
    hoveredRef.current = true;
    setHovered(true);
    setHighlightedNodes([source, target]);
  };

  const handleMouseLeave = () => {
    hoveredRef.current = false;
    setHovered(false);
    setMousePos(null);
    setHighlightedNodes(null);
  };

  let sx = sourceX;
  let sy = sourceY;
  let tx = targetX;
  let ty = targetY;
  let sPos = sourcePosition;
  let tPos = targetPosition;

  if (sourceNode?.width != null && targetNode?.width != null) {
    const sourceRect = getNodeRect(sourceNode);
    const targetRect = getNodeRect(targetNode);
    const sourcePoint = getNodeIntersection(sourceRect, targetRect);
    const targetPoint = getNodeIntersection(targetRect, sourceRect);

    sx = sourcePoint.x;
    sy = sourcePoint.y;
    tx = targetPoint.x;
    ty = targetPoint.y;
    sPos = getEdgePosition(sourceRect, sourcePoint);
    tPos = getEdgePosition(targetRect, targetPoint);
  }

  const {
    path: edgePath,
    labelX,
    labelY,
  } = getReferencePath({
    source: { x: sx, y: sy },
    target: { x: tx, y: ty },
    sourcePosition: sPos,
    targetPosition: tPos,
  });

  const strokeColor = hovered ? EDGE_COLOR_HOVER : EDGE_COLOR;
  const strokeOpacity = hovered ? EDGE_OPACITY_HOVER : EDGE_OPACITY;
  const markerId = `ref-arrow-${id}`;
  const commentX = mousePos?.x ?? labelX;
  const commentY = mousePos?.y ?? labelY;

  const sharedHoverProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
  };

  return (
    <>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M 1 1 L 9 5 L 1 9 z" style={{ fill: strokeColor, opacity: strokeOpacity }} />
        </marker>
      </defs>
      <path
        d={edgePath}
        fill="none"
        markerEnd={`url(#${markerId})`}
        style={{
          stroke: strokeColor,
          strokeOpacity,
          strokeWidth: 1,
          strokeDasharray: '5,5',
          transition: 'stroke 0.15s, stroke-opacity 0.15s',
        }}
      />
      <path
        d={edgePath}
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
