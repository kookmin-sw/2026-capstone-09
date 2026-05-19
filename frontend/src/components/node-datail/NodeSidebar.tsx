'use client';

import { IconButton } from '@wanteddev/wds';
import { IconFull } from '@wanteddev/wds-icon';
import Link from 'next/link';
import { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import {
  getServerSnapshot,
  getSessionSnapshot,
  SESSION_KEY,
  subscribeToSession,
} from '@/utils/sidebarSnapshot';
import { YjsProvider } from '@/contexts/YjsContext';
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

  useEffect(() => {
    if (nodeId) {
      sessionStorage.setItem(SESSION_KEY, nodeId.toString());
    }
  }, [nodeId]);

  const activeNodeId = nodeId ?? savedNodeId;
  const numericNodeId = Number(activeNodeId);
  const isOpen = !!activeNodeId;

  const handleClose = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    onClose();
  }, [onClose]);

  if (!isOpen || !activeNodeId || !Number.isFinite(numericNodeId)) return null;

  return (
    <>
      {/* 오버레이 */}
      {/* TODO : 현재 새로고침 하거나 다른 페이지 다녀오면 오버레이 안 먹히는 상태 - 수정 필요 */}
      <div className="fixed inset-0 z-30" onClick={handleClose} aria-hidden="true" />

      {/* 사이드바 */}
      {/* TODO : 지금 열릴 때만 애니메이션 적용됨 - 추후 닫힐 때 애니메이션 구현 */}
      {/* TODO : z-index 한 번에 관리할 수 있도록 정리 */}
      <aside
        className="animate-slide-in fixed top-0 right-0 z-90 flex h-full w-2/5 flex-col border-l border-white bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TODO : 전체 페이지의 경우 페이지 닫는 아이콘으로 변경 필요 */}
        {/* TODO : 사이드바 닫는 아이콘 필요 */}
        <div className="absolute -scale-x-100 p-3">
          <IconButton
            color="semantic.label.alternative"
            href={`/projects/${projectId}/nodes/${activeNodeId}/${value}`}
            onClick={handleClose}
            size={16}
            aria-label="전체화면 보기"
            as={Link}
          >
            <IconFull />
          </IconButton>
        </div>

        <div className="flex-1 overflow-hidden px-14 pt-14">
          <YjsProvider nodeId={numericNodeId}>
            <NodeDetailLayout
              nodeId={nodeId}
              projectId={projectId}
              noteContent={<NodeNoteTab nodeId={nodeId} projectId={projectId} />}
              meetingContent={<NodeMeetingTab nodeId={nodeId} projectId={projectId} />}
              value={value}
              onValueChange={setValue}
            />
          </YjsProvider>
        </div>
      </aside>
    </>
  );
}
