'use client';

import { IconButton } from '@wanteddev/wds';
import { IconFull } from '@wanteddev/wds-icon';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { NodeDetailLayout } from './NodeDetailLayout';
import NodeMeetingTab from './NodeMeetingTab';
import NodeNoteTab from './NodeNoteTab';

const SESSION_KEY = 'node_sidebar_open';

interface NodeSidebarProps {
  nodeId: string | null; // null이면 사이드바 닫힘
  onClose: () => void;
}

export function NodeSidebar({ nodeId, onClose }: NodeSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [value, setValue] = useState('note');

  // 마운트 시 sessionStorage에서 복원
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setActiveNodeId(saved);
      setIsOpen(true);
    }
  }, []);

  // 외부에서 nodeId prop이 변경될 때 (노드 카드 클릭)
  useEffect(() => {
    if (nodeId) {
      setActiveNodeId(nodeId);
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, nodeId);
    }
  }, [nodeId]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    sessionStorage.removeItem(SESSION_KEY);
    onClose();
  }, [onClose]);

  if (!isOpen || !activeNodeId) return null;

  return (
    <>
      {/* 오버레이 (선택적 - 지금은 투명) */}
      <div className="fixed inset-0 z-30" onClick={handleClose} aria-hidden="true" />

      {/* 사이드바 패널 */}
      {/* TODO : 지금 열릴 때만 애니메이션 적용됨 - 추후 닫힐 때 애니메이션 구현 */}
      {/* TODO : z-index 한 번에 관리할 수 있도록 정리 */}
      <aside
        className="animate-slide-in fixed top-0 right-0 z-40 flex h-full w-2/5 flex-col border-l border-white bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 사이드바 상단 툴바 */}
        {/* 전체 페이지로 확장하는 아이콘 */}
        {/* TODO : 전체 페이지의 경우 페이지 닫는 아이콘으로 변경 필요 */}
        <div className="absolute -scale-x-100 p-3">
          <IconButton
            color="semantic.label.alternative"
            href={`/nodes/${activeNodeId}/${value}`}
            size={16}
            aria-label="전체화면 보기"
            as={Link}
          >
            <IconFull />
          </IconButton>
        </div>

        <div className="flex-1 overflow-hidden px-14 pt-14">
          <NodeDetailLayout
            nodeId={nodeId}
            noteContent={<NodeNoteTab />}
            meetingContent={<NodeMeetingTab />}
            value={value}
            onValueChange={setValue}
          />
        </div>
      </aside>
    </>
  );
}
