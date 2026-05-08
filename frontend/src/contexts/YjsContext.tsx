'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { authStorage } from '@/api/authStorage';

/** awareness에 저장하는 현재 유저 상태 */
export interface YjsAwarenessState {
  user: {
    userId: number;
    nickname: string;
    profileImageUrl: string | null;
    /** 커서·아바타에 사용할 랜덤 색상 */
    color: string;
  };
}

export interface YjsContextValue {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
}

/** 노드 문서 내 공유 Y 타입의 키 이름 */
export const YJS_FIELDS = {
  title: 'title',             // Y.Text  — 제목
  description: 'description', // Y.Text  — 설명
  note: 'note',               // Y.Text  — 노트 본문
  meta: 'meta',               // Y.Map   — 진행 상태 등 단순 필드
  tags: 'tags',               // Y.Array — { tagId, name, color }
  assignees: 'assignees',     // Y.Array — { userId, nickname, profileImageUrl }
} as const;

const AWARENESS_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#85C1E9',
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
  const token = authStorage.getAccess();
  const provider = new WebsocketProvider(serverUrl, `node-${nodeId}`, ydoc, {
    ...(token && { params: { token } }),
  });

  // 세션마다 랜덤 색상을 awareness에 설정 (커서·프레즌스 표시용)
  const color = AWARENESS_COLORS[Math.floor(Math.random() * AWARENESS_COLORS.length)];
  provider.awareness.setLocalStateField('user', { color });

  return { ydoc, provider };
}

/**
 * YjsProvider의 key prop으로 nodeId 변경 시 리마운트된다.
 * useState 초기화 함수에서 생성하고 effect cleanup에서만 정리한다.
 * (effect 내 setState 호출을 피하기 위한 패턴)
 */
function YjsInstance({ nodeId, children }: { nodeId: number; children: React.ReactNode }) {
  const [value] = useState<YjsContextValue | null>(() => createYjsState(nodeId));

  useEffect(() => {
    return () => {
      value?.provider.destroy();
      value?.ydoc.destroy();
    };
  }, [value]);

  return <YjsContext.Provider value={value}>{children}</YjsContext.Provider>;
}

/**
 * nodeId별로 Yjs 연결을 관리하는 프로바이더.
 * nodeId가 바뀌면 key 교체로 YjsInstance를 리마운트해 WebSocket 연결을 재설정한다.
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
