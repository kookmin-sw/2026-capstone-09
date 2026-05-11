'use client';

import { useState } from 'react';
import { NodeSidebar } from '@/components/node-datail/NodeSidebar';

const Demo = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const demoNodes = [
    { id: 1, title: '메인 노드 제목입니다.' },
    { id: 2, title: '디자인 회의일걸요?' },
    { id: 3, title: '디자인 회의일걸요?' },
  ];

  return (
    <>
      {/* 테스트용 임시 노드 */}
      {demoNodes.map((node) => (
        <button
          key={node.id}
          onClick={() => setSelectedNodeId(node.id)}
          className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
        >
          <div className="mb-1 text-xs text-gray-400">#{node.id} · 2026.03.29</div>
          <div className="text-sm font-semibold text-gray-800">{node.title}</div>
          <div className="mt-2 flex gap-1.5">
            <span className="rounded-full border border-teal-100 bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
              텍스트
            </span>
            <span className="rounded-full border border-teal-100 bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
              텍스트
            </span>
          </div>
        </button>
      ))}

      {/* 사이드바 임시용 테스트 프로젝트 아이디 */}
      <NodeSidebar nodeId={selectedNodeId} projectId={1} onClose={() => setSelectedNodeId(null)} />
    </>
  );
};

export default Demo;
