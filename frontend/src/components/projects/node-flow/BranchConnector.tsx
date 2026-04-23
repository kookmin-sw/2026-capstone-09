'use client';

interface Branch {
  y: number;
  endX: number;
  nodeId?: number;
}

interface BranchConnectorProps {
  trunkX: number;
  trunkStartY: number;
  trunkEndY: number;
  branches: Branch[];
}

export function BranchConnector({ trunkX, trunkStartY, trunkEndY, branches }: BranchConnectorProps) {
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
      {/* 화살표 */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="#94A3B8" />
        </marker>
      </defs>

      {/* 수직선 */}
      <line
        x1={trunkX}
        y1={trunkStartY}
        x2={trunkX}
        y2={trunkEndY}
        stroke="#94A3B8"
        strokeWidth={1}
      />

      {/* 수평선 */}
      {branches.map((branch, index) => (
        <line
          key={`branch-${index}`}
          x1={trunkX}
          y1={branch.y}
          x2={branch.endX}
          y2={branch.y}
          stroke="#94A3B8"
          strokeWidth={1}
          markerEnd="url(#arrowhead)"
        />
      ))}
    </svg>
  );
}