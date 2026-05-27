'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface EdgeHoverContextValue {
  /** 현재 호버된 참조 엣지가 연결한 노드 id 집합 (시각적 포커스용, 실제 선택 아님) */
  highlightedNodeIds: ReadonlySet<string>;
  /** 하이라이트할 노드 id를 설정. null/빈 배열이면 해제 */
  setHighlightedNodes: (ids: readonly string[] | null) => void;
}

const EMPTY: ReadonlySet<string> = new Set();

const EdgeHoverContext = createContext<EdgeHoverContextValue | null>(null);

export function EdgeHoverProvider({ children }: { children: ReactNode }) {
  const [highlightedNodeIds, setIds] = useState<ReadonlySet<string>>(EMPTY);

  const setHighlightedNodes = useCallback((ids: readonly string[] | null) => {
    setIds(ids && ids.length > 0 ? new Set(ids) : EMPTY);
  }, []);

  const value = useMemo(
    () => ({ highlightedNodeIds, setHighlightedNodes }),
    [highlightedNodeIds, setHighlightedNodes],
  );

  return <EdgeHoverContext.Provider value={value}>{children}</EdgeHoverContext.Provider>;
}

export function useEdgeHover(): EdgeHoverContextValue {
  return (
    useContext(EdgeHoverContext) ?? {
      highlightedNodeIds: EMPTY,
      setHighlightedNodes: () => {},
    }
  );
}
