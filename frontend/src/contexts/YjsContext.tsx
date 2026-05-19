'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

/** awareness에 저장하는 현재 유저 상태 */
export interface YjsAwarenessState {
  user: {
    userId: number;
    nickname: string;
    profileImageUrl: string | null;
    color: string;
  };
}

export interface YjsContextValue {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
}

/** 노드 문서 내 공유 Y 타입의 키 이름 */
export const YJS_FIELDS = {
  title: 'title', // Y.XmlFragment — 제목 (TipTap Collaboration)
  description: 'description', // Y.XmlFragment — 설명 (TipTap Collaboration)
  note: 'note', // Y.XmlFragment — 노트 본문 (TipTap Collaboration)
  meta: 'meta', // Y.Map         — 진행 상태 등 단순 필드
  tags: 'tags', // Y.Array       — { tagId, name, color }
  assignees: 'assignees', // Y.Array       — { userId, nickname, profileImageUrl }
} as const;

const AWARENESS_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#85C1E9',
];

const YjsContext = createContext<YjsContextValue | null>(null);

/**
 * 브라우저 환경에서만 Y.Doc과 WebsocketProvider를 생성한다.
 * SSR(typeof window === 'undefined') 시에는 null을 반환한다.
 */
function createYjsState(nodeId: number): YjsContextValue | null {
  if (typeof window === 'undefined') return null;

  const serverUrl = process.env.NEXT_PUBLIC_YJS_WS_URL ?? 'ws://localhost:1234';
  const ydoc = new Y.Doc();

  // 서버용 인증 토큰 로컬 서버에서 임시로 제거
  // const token = authStorage.getAccess();
  // const provider = new WebsocketProvider(serverUrl, `node-${nodeId}`, ydoc, {token && {params: {token}}});
  const provider = new WebsocketProvider(serverUrl, `node-${nodeId}`, ydoc);

  // 세션 랜덤 색 설정
  const color = AWARENESS_COLORS[Math.floor(Math.random() * AWARENESS_COLORS.length)];
  provider.awareness.setLocalStateField('user', { color });

  return { ydoc, provider };
}

// YjsProvider의 key prop으로 nodeId 변경 시 리마운트된다.
function YjsInstance({ nodeId, children }: { nodeId: number; children: React.ReactNode }) {
  const [value, setValue] = useState<YjsContextValue | null>(null);

  useEffect(() => {
    const yjsValue = createYjsState(nodeId);
    // nodeId가 바뀌지 않는 한 effect가 재실행되지 않으므로 cascading render 없으므로 lint 무시 가능...?
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(yjsValue);
    return () => {
      yjsValue?.provider.destroy();
      yjsValue?.ydoc.destroy();
    };
  }, [nodeId]);

  return <YjsContext.Provider value={value}>{children}</YjsContext.Provider>;
}

/**
 * nodeId별로 Yjs 연결 관리용 프로바이더
 * nodeId가 바뀌면 key 교체로 YjsInstance를 리마운트해 WebSocket 연결 재설정
 */
export function YjsProvider({ nodeId, children }: { nodeId: number; children: React.ReactNode }) {
  return (
    <YjsInstance key={nodeId} nodeId={nodeId}>
      {children}
    </YjsInstance>
  );
}

/** WebSocket 연결 준비 전(SSR 포함)에는 null을 반환한다 */
export function useYjsContext() {
  return useContext(YjsContext);
}
