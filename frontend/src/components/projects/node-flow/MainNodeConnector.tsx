'use client';

import { useLayoutEffect, useState } from 'react';

interface MainNodeConnectorProps {
  startNodeId?: number;
  endNodeId?: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  zoom?: number;
}

export function MainNodeConnector({
  startNodeId,
  endNodeId,
  containerRef,
  zoom = 1,
}: MainNodeConnectorProps) {
  const [lineData, setLineData] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  useLayoutEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const calculateLine = () => {
      if (!containerRef.current) return;

      const startNodeEl = document.querySelector(`[data-node-id="${startNodeId}"]`) as HTMLElement;
      const endNodeEl = document.querySelector(`[data-node-id="${endNodeId}"]`) as HTMLElement;

      if (!startNodeEl || !endNodeEl) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const startRect = startNodeEl.getBoundingClientRect();
      const endRect = endNodeEl.getBoundingClientRect();

      const x1 = (startRect.right - containerRect.left) / zoom;
      const y1 = (startRect.top + startRect.height / 2 - containerRect.top) / zoom;
      const x2 = (endRect.left - containerRect.left) / zoom;
      const y2 = (endRect.top + endRect.height / 2 - containerRect.top) / zoom;

      const avgY = (y1 + y2) / 2;

      setLineData({ x1, y1: avgY, x2, y2: avgY });
    };

    const debouncedCalculate = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(calculateLine, 10);
    };

    const timer = setTimeout(calculateLine, 100);

    const observer = new ResizeObserver(debouncedCalculate);
    const mutationObserver = new MutationObserver(debouncedCalculate);

    const startNodeEl = document.querySelector(`[data-node-id="${startNodeId}"]`) as HTMLElement;
    const endNodeEl = document.querySelector(`[data-node-id="${endNodeId}"]`) as HTMLElement;

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    if (startNodeEl) {
      observer.observe(startNodeEl);
      if (startNodeEl.parentElement?.parentElement) {
        observer.observe(startNodeEl.parentElement.parentElement);
      }
    }
    if (endNodeEl) {
      observer.observe(endNodeEl);
      if (endNodeEl.parentElement?.parentElement) {
        observer.observe(endNodeEl.parentElement.parentElement);
      }
    }

    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(debounceTimer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [startNodeId, endNodeId, zoom]);

  return (
    <>
      {lineData && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          style={{ zIndex: 0 }}
        >
          <line
            x1={lineData.x1}
            y1={lineData.y1}
            x2={lineData.x2}
            y2={lineData.y2}
            stroke="#E5E7EB"
            strokeWidth={2}
          />
        </svg>
      )}
    </>
  );
}
