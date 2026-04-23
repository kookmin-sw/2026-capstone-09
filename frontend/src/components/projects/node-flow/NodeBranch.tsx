'use client';

import { useRef, useLayoutEffect, useState } from 'react';
import type { Node, Edge } from '@/types/FlowChartTypes';
import { BaseNode } from './BaseNode';
import { BranchConnector } from './BranchConnector';
import { HorizontalConnector } from './HorizontalConnector';

interface NodeBranchProps {
  mainNode: Node;
  subNodes: Node[];
  allNodes: Node[];
  allEdges: Edge[];
  focusedNodeId: number | null;
  onNodeClick: (nodeId: number, e?: React.MouseEvent) => void;
  onCreateSubNode?: (parentNodeId: number) => void;
  onCreateReference?: (startNodeId: number) => void;
  onDeleteNode?: (nodeId: number) => void;
  depth?: number;
  zoom?: number;
}

interface BranchPosition {
  y: number;
  endX: number;
  nodeId: number;
}

export function NodeBranch({
  mainNode,
  subNodes,
  allNodes,
  allEdges,
  focusedNodeId,
  onNodeClick,
  onCreateSubNode,
  onCreateReference,
  onDeleteNode,
  depth = 0,
  zoom = 1,
}: NodeBranchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainNodeRef = useRef<HTMLDivElement>(null);
  const childRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const prevSubNodesLength = useRef(-1);
  const [layoutVersion, setLayoutVersion] = useState(0);

  const isVertical = depth === 0;

  const CONNECTION_Y_OFFSET = 32;

  const [lineData, setLineData] = useState<{
    trunkX: number;
    trunkStartY: number;
    trunkEndY: number;
    branches: BranchPosition[];
  } | null>(null);

  const [horizontalLineData, setHorizontalLineData] = useState<{
    parentX: number;
    parentY: number;
    parentWidth: number;
    childPositions: Array<{ y: number; endX: number }>;
  } | null>(null);

  const renderChildNode = (subNode: Node) => {
    const subSubNodes = subNode.childNodeIds
      .map((childId) => allNodes.find((n) => n.nodeId === childId))
      .filter((n): n is Node => n !== undefined);

    const setSubNodeRef = (el: HTMLDivElement | null) => {
      if (el) {
        childRefs.current[subNode.nodeId] = el;
      }
    };

    return (
      <div key={subNode.nodeId}>
        {subSubNodes.length > 0 ? (
          <div ref={setSubNodeRef} data-has-children="true">
            <NodeBranch
              mainNode={subNode}
              subNodes={subSubNodes}
              allNodes={allNodes}
              allEdges={allEdges}
              focusedNodeId={focusedNodeId}
              onNodeClick={onNodeClick}
              onCreateSubNode={onCreateSubNode}
              onCreateReference={onCreateReference}
              onDeleteNode={onDeleteNode}
              depth={depth + 1}
              zoom={zoom}
            />
          </div>
        ) : (
          <div ref={setSubNodeRef} data-has-children="false">
            <BaseNode
              node={subNode}
              variant="sub"
              isFocused={focusedNodeId === subNode.nodeId}
              onNodeClick={onNodeClick}
              onCreateSubNode={onCreateSubNode}
              onCreateReference={onCreateReference}
              onDeleteNode={onDeleteNode}
              allNodes={allNodes}
            />
          </div>
        )}
      </div>
    );
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    let debounceTimer: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setLayoutVersion((v) => v + 1);
      }, 10);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(debounceTimer);
      resizeObserver.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const calculatePositions = () => {
      if (subNodes.length === 0) {
        setLineData(null);
        setHorizontalLineData(null);
        return;
      }

      prevSubNodesLength.current = subNodes.length;

      if (!isVertical) {
        if (!containerRef.current || !mainNodeRef.current || subNodes.length === 0) {
          setHorizontalLineData(null);
          return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();

        const baseNodeEl = mainNodeRef.current.firstElementChild as HTMLElement;
        if (!baseNodeEl) {
          setHorizontalLineData(null);
          return;
        }
        const mainRect = baseNodeEl.getBoundingClientRect();

        const childPositions = subNodes
          .map((child) => {
            const el = childRefs.current[child.nodeId];
            if (!el) return null;

            let targetEl: HTMLElement = el;
            if (el.getAttribute('data-has-children') === 'true') {
              const container = el.firstElementChild;
              if (container) {
                const layoutWrapper = container.firstElementChild as HTMLElement;
                if (layoutWrapper) {
                  const mainNodeWrapper = layoutWrapper.firstElementChild as HTMLElement;
                  if (mainNodeWrapper) {
                    const baseNode = mainNodeWrapper.firstElementChild as HTMLElement;
                    if (baseNode) {
                      targetEl = baseNode;
                    }
                  }
                }
              }
            } else {
              const baseNode = el.firstElementChild as HTMLElement;
              if (baseNode) {
                targetEl = baseNode;
              }
            }

            const rect = targetEl.getBoundingClientRect();

            return {
              y: (rect.top - containerRect.top) / zoom + CONNECTION_Y_OFFSET, // zoom 보정
              endX: (rect.left - containerRect.left) / zoom,
            };
          })
          .filter((pos): pos is { y: number; endX: number } => pos !== null);

        setHorizontalLineData({
          parentX: (mainRect.left - containerRect.left) / zoom,
          parentY: (mainRect.top - containerRect.top) / zoom,
          parentWidth: mainRect.width / zoom,
          childPositions,
        });

        setLineData(null);
        return;
      }

      if (!containerRef.current || !mainNodeRef.current) {
        return;
      }
      if (subNodes.length === 0) {
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const mainRect = mainNodeRef.current.getBoundingClientRect();

      const childPositions: BranchPosition[] = subNodes
        .map((child) => {
          const el = childRefs.current[child.nodeId];
          if (!el) return null;

          let targetEl: HTMLElement = el;
          if (el.getAttribute('data-has-children') === 'true') {
            const container = el.firstElementChild;
            if (container) {
              const layoutWrapper = container.firstElementChild as HTMLElement;
              if (layoutWrapper) {
                const mainNodeWrapper = layoutWrapper.firstElementChild as HTMLElement;
                if (mainNodeWrapper) {
                  const baseNode = mainNodeWrapper.firstElementChild as HTMLElement;
                  if (baseNode) {
                    targetEl = baseNode;
                  }
                }
              }
            }
          } else {
            const baseNode = el.firstElementChild as HTMLElement;
            if (baseNode) {
              targetEl = baseNode;
            }
          }

          const rect = targetEl.getBoundingClientRect();

          return {
            nodeId: child.nodeId,
            y: (rect.top - containerRect.top) / zoom + CONNECTION_Y_OFFSET, // zoom 보정
            endX: (rect.left - containerRect.left) / zoom,
          };
        })
        .filter((pos): pos is BranchPosition => pos !== null);

      if (childPositions.length === 0) return;

      const firstChildX = childPositions[0].endX;
      const trunkX = firstChildX - 32;

      const trunkStartY = (mainRect.bottom - containerRect.top) / zoom;

      const trunkEndY = childPositions[childPositions.length - 1].y;

      setLineData({
        trunkX,
        trunkStartY,
        trunkEndY,
        branches: childPositions,
      });
    };

    const timer = setTimeout(calculatePositions, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [subNodes, isVertical, layoutVersion]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-[22px]"
    >
      <div className={isVertical ? 'flex flex-col' : 'flex flex-row gap-8 items-start'}>
        <div ref={mainNodeRef} className="relative">
          <BaseNode
            node={mainNode}
            variant={depth === 0 ? 'main' : 'sub'}
            isFocused={focusedNodeId === mainNode.nodeId}
            onNodeClick={onNodeClick}
            onCreateSubNode={onCreateSubNode}
            onCreateReference={onCreateReference}
            onDeleteNode={onDeleteNode}
            allNodes={allNodes}
          />
        </div>

        {subNodes.length > 0 && !isVertical && (
          <div className="flex flex-col gap-[22px]">
            {subNodes.map(renderChildNode)}
          </div>
        )}
      </div>

      {subNodes.length > 0 && isVertical && (
        <div className="flex flex-col gap-[22px] ml-20">
          {subNodes.map(renderChildNode)}
        </div>
      )}

      {lineData && (
        <BranchConnector
          trunkX={lineData.trunkX}
          trunkStartY={lineData.trunkStartY}
          trunkEndY={lineData.trunkEndY}
          branches={lineData.branches}
        />
      )}

      {horizontalLineData && (
        <HorizontalConnector
          parentX={horizontalLineData.parentX}
          parentY={horizontalLineData.parentY}
          parentWidth={horizontalLineData.parentWidth}
          childPositions={horizontalLineData.childPositions}
        />
      )}
    </div>
  );
}