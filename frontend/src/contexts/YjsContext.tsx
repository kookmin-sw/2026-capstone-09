'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { useCurrentUserQuery } from '@/queries/user';

/** awareness에 저장하는 현재 유저 상태 */
export interface YjsAwarenessState {
  user: {
    userId: number;
    email: string;
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
function createYjsState(room: string): YjsContextValue | null {
  if (typeof window === 'undefined') return null;

  const serverUrl = process.env.NEXT_PUBLIC_YJS_WS_URL ?? 'ws://localhost:1234';
  const ydoc = new Y.Doc();

  // 서버용 인증 토큰 로컬 서버에서 임시로 제거
  // const token = authStorage.getAccess();
  // const provider = new WebsocketProvider(serverUrl, room, ydoc, {token && {params: {token}}});
  const provider = new WebsocketProvider(serverUrl, room, ydoc);

  // 세션 랜덤 색 설정
  const color = AWARENESS_COLORS[Math.floor(Math.random() * AWARENESS_COLORS.length)];
  provider.awareness.setLocalStateField('user', { color });

  return { ydoc, provider };
}

// 상위 Provider의 key prop으로 room 변경 시 리마운트된다.
function YjsInstance({ room, children }: { room: string; children: React.ReactNode }) {
  const [value, setValue] = useState<YjsContextValue | null>(null);
  const { data: currentUser } = useCurrentUserQuery();

  useEffect(() => {
    const yjsValue = createYjsState(room);
    // room이 바뀌지 않는 한 effect가 재실행되지 않으므로 cascading render 없으므로 lint 무시 가능...?
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(yjsValue);
    return () => {
      yjsValue?.provider.destroy();
      yjsValue?.ydoc.destroy();
    };
  }, [room]);

  useEffect(() => {
    if (!value || !currentUser) return;
    const existingColor =
      (value.provider.awareness.getLocalState() as Partial<YjsAwarenessState> | null)?.user
        ?.color ?? AWARENESS_COLORS[0];
    value.provider.awareness.setLocalStateField('user', {
      userId: value.provider.awareness.clientID,
      email: currentUser.email ?? '',
      nickname: currentUser.nickname ?? '',
      profileImageUrl: currentUser.profileImageUrl ?? null,
      color: existingColor,
    });
  }, [value, currentUser]);

  return <YjsContext.Provider value={value}>{children}</YjsContext.Provider>;
}

export function useAwarenessUsers(): YjsAwarenessState['user'][] {
  const yjsCtx = useYjsContext();
  const [users, setUsers] = useState<YjsAwarenessState['user'][]>([]);

  useEffect(() => {
    if (!yjsCtx) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsers([]);
      return;
    }

    const { provider } = yjsCtx;

    const updateUsers = () => {
      const result: YjsAwarenessState['user'][] = [];
      provider.awareness.getStates().forEach((state, clientId) => {
        const s = state as Partial<YjsAwarenessState>;
        if (s.user?.nickname) {
          result.push({ ...s.user, userId: clientId });
        }
      });
      setUsers(result);
    };

    updateUsers();
    provider.awareness.on('change', updateUsers);
    return () => provider.awareness.off('change', updateUsers);
  }, [yjsCtx]);

  return users;
}

/**
 * nodeId별로 Yjs 연결 관리용 프로바이더 (노드 상세용)
 * nodeId가 바뀌면 key 교체로 YjsInstance를 리마운트해 WebSocket 연결 재설정
 */
export function YjsProvider({ nodeId, children }: { nodeId: number; children: React.ReactNode }) {
  const room = `node-${nodeId}`;
  return (
    <YjsInstance key={room} room={room}>
      {children}
    </YjsInstance>
  );
}

/**
 * 프로젝트 단위 presence 전용 프로바이더.
 * 같은 프로젝트를 보고 있는 유저들이 `project-${projectId}` 룸에서 awareness만 공유한다.
 * (ydoc 공유 필드는 사용하지 않음 — 단순 presence 용도)
 */
export function ProjectPresenceProvider({
  projectId,
  children,
}: {
  projectId: number;
  children: React.ReactNode;
}) {
  const room = `project-${projectId}`;
  return (
    <YjsInstance key={room} room={room}>
      {children}
    </YjsInstance>
  );
}

/** WebSocket 연결 준비 전(SSR 포함)에는 null을 반환한다 */
export function useYjsContext() {
  return useContext(YjsContext);
}
