'use client';

interface ChildPosition {
  y: number;
  endX: number;
}

interface HorizontalConnectorProps {
  parentX: number;
  parentY: number;
  parentWidth: number;
  childPositions: ChildPosition[];
}

export function HorizontalConnector({ parentX, parentY, parentWidth, childPositions }: HorizontalConnectorProps) {
  if (childPositions.length === 0) return null;

  const CONNECTION_Y_OFFSET = 32;
  const startX = parentX + parentWidth;
  const startY = parentY + CONNECTION_Y_OFFSET;

  const firstChildLeftEdge = childPositions[0].endX;
  const midX = startX + (firstChildLeftEdge - startX) / 2;

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        zIndex: 10,
      }}
    >
      {/* 화살표 marker */}
      <defs>
        <marker
          id="arrowhead-horizontal"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="#94A3B8" />
        </marker>
      </defs>

      {/* 부모에서 오른쪽으로 수평선 */}
      <line
        x1={startX}
        y1={startY}
        x2={midX}
        y2={startY}
        stroke="#94A3B8"
        strokeWidth={1}
      />

      {/* 자식이 여러 개일 때 */}
      {childPositions.length > 1 && (
        <>
          {/* 수직 trunk (부모 높이에서 마지막 자식까지) */}
          <line
            x1={midX}
            y1={startY}
            x2={midX}
            y2={childPositions[childPositions.length - 1].y}
            stroke="#94A3B8"
            strokeWidth={1}
          />

          {/* 각 자식으로 가는 branch */}
          {childPositions.map((pos, index) => (
            <line
              key={index}
              x1={midX}
              y1={pos.y}
              x2={pos.endX}
              y2={pos.y}
              stroke="#94A3B8"
              strokeWidth={1}
              markerEnd="url(#arrowhead-horizontal)"
            />
          ))}
        </>
      )}

      {/* 자식이 하나일 때 직선 */}
      {childPositions.length === 1 && (
        <line
          x1={midX}
          y1={startY}
          x2={childPositions[0].endX}
          y2={childPositions[0].y}
          stroke="#94A3B8"
          strokeWidth={1}
          markerEnd="url(#arrowhead-horizontal)"
        />
      )}
    </svg>
  );
}