'use client';

import { useEffect, useState } from 'react';
import Editor from '../commons/editor/editor';
import { privateApi } from '@/api';

interface NodeNoteTabProps {
  nodeId: number | null;
  projectId: number;
}

export default function NodeNoteTab({ nodeId, projectId }: NodeNoteTabProps) {
  const [content, setContent] = useState<string | undefined>('테스트');

  useEffect(() => {
    const fetchNodeDetail = async () => {
      try {
        // TODO : 노드 플로우 페이지 API 연결 이후 제대로 된 nodeId 받아올 수 있도록
        const data = await privateApi.node.getNode(projectId, nodeId);
        setContent(data.data.data?.noteContent);
      } catch (error) {
        console.error('Failed to load flowchart:', error);
      }
    };
    void fetchNodeDetail();
  }, [nodeId]);

  return (
    <main className="flex">
      <Editor content={content} />
    </main>
  );
}
