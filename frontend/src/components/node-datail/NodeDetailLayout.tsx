'use client';

import { EditorContent } from '@tiptap/react';
import { ContentBadge, Tab, TabList, TabListItem, TabPanel, Typography } from '@wanteddev/wds';
import {
  IconDocumentText,
  IconFire,
  IconMoreVertical,
  IconPersons,
  IconTag,
} from '@wanteddev/wds-icon';
import { useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { AssigneeItem, GetNodeResponse, TagItem } from '@/api/Api';
import GoogleMeetIcon from '@/assets/svgs/google-meet.svg';
import { EXAMPLE_USERS } from '@/constants/exampleConstant';
import { NodeStatusType } from '@/constants/nodeStatus';
import { formatDatetoString } from '@/utils/formatData';
import { AssigneeField } from './fields/AssigneeField';
import { DescriptionField } from './fields/DescriptionField';
import { StatusField } from './fields/StatusField';
import { TagField } from './fields/TagField';
import { useTitleEditor } from './hooks/useTitleEditor';
import { Users } from '../commons/user/UserAvatarGroup';

interface NodeDetailLayoutProps {
  nodeId: number | null;
  projectId: number;
  noteContent: React.ReactNode;
  meetingContent: React.ReactNode;
  value?: string;
  onValueChange?: (tab: string) => void;
}

export function NodeDetailLayout({
  nodeId,
  projectId,
  noteContent,
  meetingContent,
  value,
  onValueChange,
}: NodeDetailLayoutProps) {
  const [nodeDetail, setNodeDetail] = useState<GetNodeResponse | undefined>(undefined);

  const handleTitleUpdate = async (title: string) => {
    if (!nodeId || title === (nodeDetail?.title ?? '')) return;
    const previous = nodeDetail?.title ?? '';
    setNodeDetail((prev) => (prev ? { ...prev, title } : prev));
    try {
      await privateApi.node.updateNodeTitle(projectId, nodeId, { title });
    } catch {
      setNodeDetail((prev) => (prev ? { ...prev, title: previous } : prev));
    }
  };

  const titleEditor = useTitleEditor(nodeDetail?.title, handleTitleUpdate);

  useEffect(() => {
    const fetchNodeDetail = async () => {
      try {
        if (!projectId || !nodeId) return;
        const data = await privateApi.node.getNode(projectId, nodeId ?? 0);
        setNodeDetail(data.data.data);
      } catch (error) {
        console.error('Failed to load node detail:', error);
      }
    };
    void fetchNodeDetail();
  }, [projectId, nodeId]);

  const handleStatusUpdate = (status: NodeStatusType) => {
    setNodeDetail((prev) => (prev ? { ...prev, status } : prev));
  };

  const handleDescriptionUpdate = (description: string) => {
    setNodeDetail((prev) => (prev ? { ...prev, description } : prev));
  };

  const handleTagAdd = (tag: TagItem) => {
    setNodeDetail((prev) => (prev ? { ...prev, tags: [...(prev.tags ?? []), tag] } : prev));
  };

  const handleTagRemove = (tagId: number) => {
    setNodeDetail((prev) =>
      prev ? { ...prev, tags: prev.tags?.filter((t) => t.tagId !== tagId) } : prev,
    );
  };

  const handleAssigneeAdd = (assignee: AssigneeItem) => {
    setNodeDetail((prev) =>
      prev ? { ...prev, assignees: [...(prev.assignees ?? []), assignee] } : prev,
    );
  };

  const handleAssigneeRemove = (userId: number) => {
    setNodeDetail((prev) =>
      prev ? { ...prev, assignees: prev.assignees?.filter((a) => a.userId !== userId) } : prev,
    );
  };

  return (
    <div className="flex h-full flex-col overflow-y-scroll [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center justify-between">
        {nodeDetail?.parentId ? (
          <ContentBadge color="neutral" size="xsmall" variant="outlined">
            #{nodeDetail?.number}
          </ContentBadge>
        ) : (
          <ContentBadge
            className="!bg-primary-40/10 !text-primary-40"
            size="xsmall"
            variant="solid"
          >
            #{nodeDetail?.number}
          </ContentBadge>
        )}

        <div className="flex items-center gap-1 py-0.5">
          <Users users={EXAMPLE_USERS} />
          <IconMoreVertical />
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-5">
        <EditorContent editor={titleEditor} />

        <div className="flex flex-col gap-5">
          <MetaRow icon={<IconTag />} label="태그">
            {nodeId && (
              <TagField
                projectId={projectId}
                nodeId={nodeId}
                tags={nodeDetail?.tags ?? []}
                onAdd={handleTagAdd}
                onRemove={handleTagRemove}
              />
            )}
          </MetaRow>

          <MetaRow icon={<IconPersons />} label="노드 담당자">
            {nodeId && (
              <AssigneeField
                projectId={projectId}
                nodeId={nodeId}
                assignees={nodeDetail?.assignees ?? []}
                onAdd={handleAssigneeAdd}
                onRemove={handleAssigneeRemove}
              />
            )}
          </MetaRow>

          <MetaRow icon={<IconDocumentText />} label="노드 설명">
            {nodeId && (
              <DescriptionField
                projectId={projectId}
                nodeId={nodeId}
                description={nodeDetail?.description}
                onUpdate={handleDescriptionUpdate}
              />
            )}
          </MetaRow>

          <MetaRow icon={<IconFire />} label="진행 상태">
            {nodeId && nodeDetail?.status && (
              <StatusField
                projectId={projectId}
                nodeId={nodeId}
                status={nodeDetail.status as NodeStatusType}
                onUpdate={handleStatusUpdate}
              />
            )}
          </MetaRow>
        </div>

        {nodeDetail?.meeting?.meetingId ? (
          // 추후 수정 필요...
          <a
            href="https://meet.google.com/jne-evsa-qzn"
            className="text-label-1-normal flex items-center justify-between rounded-lg border border-gray-200 p-3"
          >
            <div>{formatDatetoString(nodeDetail?.meeting?.startedAt)}에 회의 예정</div>
            {/* <img
              className="h-5 w-5"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/250px-Google_Meet_icon_%282020%29.svg.png"
            /> */}
            <GoogleMeetIcon />
          </a>
        ) : (
          <></>
        )}
      </div>

      <Tab value={value} onValueChange={onValueChange} defaultValue="note">
        <TabList size="medium" resize="fill">
          <TabListItem value="note">노트</TabListItem>
          {nodeDetail?.parentId && <TabListItem value="meeting">회의</TabListItem>}
        </TabList>
        <TabPanel value="note">{noteContent}</TabPanel>
        <TabPanel
          value="meeting"
          sx={{
            flex: 1,
          }}
        >
          {meetingContent}
        </TabPanel>
      </Tab>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-label-alternative flex min-w-25 items-center gap-1">
        <span>{icon}</span>
        <Typography variant="label1">{label}</Typography>
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
