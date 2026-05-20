'use client';

import { Option, Select, TextField, Typography } from '@wanteddev/wds';
import { IconSearch } from '@wanteddev/wds-icon';
import { useCallback, useState } from 'react';

import { Loading } from '@/components/commons/loading/Loading';
import { NodeSidebar } from '@/components/node-datail/NodeSidebar';
import { useNodeListQuery } from '@/queries/node';
import { formatDate } from '@/utils/nodeUtils';

import { ListCard } from './ListCard';

interface ListViewProps {
  projectId: number;
}

type SortOption = 'latest' | 'alphabetical';

export function ListView({ projectId }: ListViewProps) {
  const [sidebarNodeId, setSidebarNodeId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const sortParam = sortBy === 'latest' ? 'LATEST' : 'NAME';
  const { data, isLoading } = useNodeListQuery(projectId, sortParam);

  const handleNodeDoubleClick = useCallback((nodeId: number) => {
    setSidebarNodeId(nodeId);
  }, []);

  const blurSelect = useCallback(() => {
    requestAnimationFrame(() => {
      const combobox = document.querySelector('.custom-select-wrapper [role="combobox"]') as HTMLElement;
      combobox?.blur();
    });
  }, []);

  const nodes = data?.nodes ?? [];
  const filteredNodes = nodes.filter((node) =>
    node.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
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

        {filteredNodes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredNodes.map((node) => (
              <ListCard
                key={node.nodeId}
                nodeId={node.nodeId ?? 0}
                projectId={projectId}
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