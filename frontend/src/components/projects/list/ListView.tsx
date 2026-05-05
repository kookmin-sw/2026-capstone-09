'use client';

import { Option, Select, TextField, Typography } from '@wanteddev/wds';
import { IconSearch } from '@wanteddev/wds-icon';
import { useCallback, useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { NodeListItem } from '@/api/Api';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { Loading } from '@/components/commons/loading/Loading';
import { NodeSidebar } from '@/components/node-datail/NodeSidebar';
import { formatDate } from '@/utils/nodeUtils';

import { ListCard } from './ListCard';

interface ListViewProps {
  projectId: number;
}

type SortOption = 'latest' | 'alphabetical';

export function ListView({ projectId }: ListViewProps) {
  const toast = usePositionedToast();
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<NodeListItem[]>([]);
  const [sidebarNodeId, setSidebarNodeId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const loadListData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await privateApi.node.getNodeList(projectId);
      const listData = data.data.data ?? null;

      setNodes(listData?.nodes ?? []);
    } catch (error) {
      console.error('Failed to load list:', error);
      const errorMessage =
        error instanceof Error ? error.message : '리스트 데이터를 불러오는데 실패했습니다.';
      toast({
        content: errorMessage,
        variant: 'negative',
        placement: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    void loadListData();
  }, [loadListData]);

  const handleNodeDoubleClick = useCallback((nodeId: number) => {
    setSidebarNodeId(nodeId);
  }, []);

  const blurSelect = useCallback(() => {
    requestAnimationFrame(() => {
      const combobox = document.querySelector('.custom-select-wrapper [role="combobox"]') as HTMLElement;
      combobox?.blur();
    });
  }, []);

  const filteredNodes = nodes.filter((node) =>
    node.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedNodes = [...filteredNodes].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      case 'alphabetical':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return 0;
    }
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 h-full w-full px-12 py-10 bg-surface-canvas overflow-auto">
      <style>{`
        .custom-select-wrapper [role="combobox"]:focus:not([aria-expanded="true"]) {
          box-shadow: inset 0 0 0 1px rgb(229, 231, 235), 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .custom-select-wrapper [role="combobox"][aria-expanded="true"] {
          box-shadow: inset 0 0 0 2px #04E6A2, 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        [role="option"][aria-selected="true"]::before,
        [role="option"][aria-selected="true"]::after {
          display: none !important;
        }
        [role="option"][aria-selected="true"] svg {
          display: none !important;
        }
        .custom-textfield-wrapper [wds-component="text-field"]:is(:focus-within, :has(input:focus)) [data-role="text-field-wrapper"] {
          box-shadow: inset 0 0 0 2px #04E6A2 !important;
        }
      `}</style>

      <div>
        <div className="mb-6 flex gap-5 items-center">
          <div className="w-36 custom-select-wrapper">
            <Select
              value={sortBy}
              onChange={(value) => {
                setSortBy(value as SortOption);
                blurSelect();
              }}
              open={isSelectOpen}
              onOpenChange={(open) => {
                setIsSelectOpen(open);
                if (!open) blurSelect();
              }}
            >
              <Option value="latest">최신순</Option>
              <Option value="alphabetical">가나다순</Option>
            </Select>
          </div>

          <div className="flex-1 custom-textfield-wrapper">
            <TextField
              placeholder="프로젝트 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leadingContent={<IconSearch />}
            />
          </div>
        </div>

        {sortedNodes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sortedNodes.map((node) => (
              <ListCard
                key={node.nodeId}
                nodeId={node.nodeId ?? 0}
                nodeNumber={node.number || ''}
                status={node.status || 'WAITING'}
                date={node.updatedAt ? formatDate(node.updatedAt) : ''}
                title={node.title || '제목 없음'}
                tags={node.tags?.map((tag) => ({
                  tagId: tag.tagId ?? 0,
                  name: tag.name ?? '',
                  color: tag.color ?? 'neutral',
                }))}
                assignees={node.assignees?.map((assignee) => ({
                  userId: assignee.userId ?? 0,
                  name: assignee.nickname ?? '',
                  profileImage: assignee.profileImageUrl,
                }))}
                isMainNode={!(node.number || '').includes('.')}
                hasMeeting={node.hasMeeting}
                onDoubleClick={() => handleNodeDoubleClick(node.nodeId ?? 0)}
                onCreateSubNode={() => {
                  // TODO: 서브 노드 생성 모달
                }}
                onCreateMeeting={() => {
                  // TODO: 회의 생성 모달
                }}
                onEditMeeting={() => {
                  // TODO: 회의 수정 모달
                }}
                onDeleteMeeting={() => {
                  // TODO: 회의 삭제 모달
                }}
                onCreateReference={() => {
                  // TODO: 참조 노드 모달
                }}
                onDelete={() => {
                  // TODO: 삭제 모달
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-label-alternative/40">
            <Typography variant="body1">
              {searchQuery ? '검색 결과가 없습니다' : '노드가 없습니다'}
            </Typography>
          </div>
        )}
      </div>

      <NodeSidebar projectId={projectId} nodeId={sidebarNodeId} onClose={() => setSidebarNodeId(null)} />
    </div>
  );
}