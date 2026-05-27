'use client';

import { IconButton } from '@wanteddev/wds';
import { IconChevronDoubleRight, IconFull } from '@wanteddev/wds-icon';
import Link from 'next/link';
import { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import { YjsProvider, useSetActiveAwarenessNode } from '@/contexts/YjsContext';
import {
  getServerSnapshot,
  getSessionSnapshot,
  SESSION_KEY,
  subscribeToSession,
  setSidebarState,
} from '@/utils/sidebarSnapshot';
import NodeMeetingTab from './meeting/NodeMeetingTab';
import { NodeDetailLayout } from './NodeDetailLayout';
import NodeNoteTab from './note/NodeNoteTab';

interface NodeSidebarProps {
  nodeId: number | null;
  projectId: number;
  onClose: () => void;
}

export function NodeSidebar({ nodeId, projectId, onClose }: NodeSidebarProps) {
  const savedNodeId = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSnapshot,
  );

  const [value, setValue] = useState('note');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (nodeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsClosing(false);
      sessionStorage.setItem(SESSION_KEY, nodeId.toString());
      setSidebarState(true);
    }
  }, [nodeId]);

  const activeNodeId = nodeId ?? savedNodeId;
  const numericNodeId = Number(activeNodeId);
  const isOpen = !!activeNodeId;
  const awarenessNodeId = isOpen && Number.isFinite(numericNodeId) ? numericNodeId : null;

  useSetActiveAwarenessNode(awarenessNodeId);

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (isClosing) {
      sessionStorage.removeItem(SESSION_KEY);
      setSidebarState(false);
      onClose();
    }
  }, [isClosing, onClose]);

  if (!isOpen || !activeNodeId || !Number.isFinite(numericNodeId)) return null;

  return (
    <>
      {/* 오버레이 */}
      {/* TODO : 현재 새로고침 하거나 다른 페이지 다녀오면 오버레이 안 먹히는 상태 - 수정 필요 */}
      <div className="fixed inset-0 z-30" onClick={handleClose} aria-hidden="true" />

      {/* 사이드바 */}
      {/* TODO : z-index 한 번에 관리할 수 있도록 정리 */}
      <aside
        className={`fixed top-0 right-0 z-90 flex h-full w-2/5 flex-col border-l border-white bg-white ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
        data-node-sidebar="true"
      >
        {/* TODO : 전체 페이지의 경우 페이지 닫는 아이콘으로 변경 필요 */}
        {/* TODO : 사이드바 닫는 아이콘 필요 */}
        <div className="absolute left-3 top-3 flex items-center gap-3">
          <IconButton
            color="semantic.label.alternative"
            onClick={handleClose}
            size={20}
            aria-label="사이드바 접기"
          >
            <IconChevronDoubleRight />
          </IconButton>
          <IconButton
            color="semantic.label.alternative"
            href={`/projects/${projectId}/nodes/${activeNodeId}/${value}`}
            onClick={handleClose}
            size={20}
            aria-label="전체화면 보기"
            as={Link}
          >
            <IconFull />
          </IconButton>
        </div>

        <div className="flex-1 overflow-hidden px-14 pt-14">
          <YjsProvider nodeId={numericNodeId}>
            <NodeDetailLayout
              nodeId={numericNodeId}
              projectId={projectId}
              noteContent={<NodeNoteTab nodeId={numericNodeId} projectId={projectId} />}
              meetingContent={<NodeMeetingTab nodeId={numericNodeId} projectId={projectId} />}
              value={value}
              onValueChange={setValue}
              onDeleteSuccess={handleClose}
            />
          </YjsProvider>
        </div>
      </aside>
    </>
  );
}
