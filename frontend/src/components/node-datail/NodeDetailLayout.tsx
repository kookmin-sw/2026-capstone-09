'use client';

import { useQueryClient } from '@tanstack/react-query';
import { EditorContent } from '@tiptap/react';
import { ContentBadge, Tab, TabList, TabListItem, TabPanel, Typography } from '@wanteddev/wds';
import { IconDocumentText, IconFire, IconPersons, IconTag } from '@wanteddev/wds-icon';
import { useEffect } from 'react';

import { GetNodeResponse } from '@/api/Api';
import { GoogleMeetIcon } from '@/assets/svgs/GoogleMeetIcon';
import { Loading } from '@/components/commons/loading/Loading';
import { NodeStatusType } from '@/constants/nodeStatus';
import { useAwarenessUsers } from '@/contexts/YjsContext';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useNodeMenuActions } from '@/hooks/useNodeMenuActions';
import { nodeKeys } from '@/queries/keys/nodeKeys';
import {
  useCreateSubNodeMutation,
  useNodeDetailQuery,
  useUpdateNodeTitleMutation,
} from '@/queries/node';
import { formatDatetoString } from '@/utils/formatData';
import { AssigneeField } from './fields/AssigneeField';
import { DescriptionField } from './fields/DescriptionField';
import { StatusField } from './fields/StatusField';
import { TagField } from './fields/TagField';
import { useTitleEditor } from './hooks/useTitleEditor';
import { Users } from '../commons/user/UserAvatarGroup';
import { NodeMenu } from '../projects/node-flow/NodeMenu';

interface NodeDetailLayoutProps {
  nodeId: number | null;
  projectId: number;
  noteContent: React.ReactNode;
  meetingContent: React.ReactNode;
  value?: string;
  onValueChange?: (tab: string) => void;
  onDeleteSuccess?: () => void;
}

export function NodeDetailLayout({
  nodeId,
  projectId,
  noteContent,
  meetingContent,
  value,
  onValueChange,
  onDeleteSuccess,
}: NodeDetailLayoutProps) {
  const queryClient = useQueryClient();
  const { data: nodeDetail, error, isLoading } = useNodeDetailQuery(projectId, nodeId);
  const activeUsers = useAwarenessUsers();
  const showErrorToast = useErrorToast();

  useEffect(() => {
    if (error) showErrorToast(error, '노드 정보를 불러오는데 실패했어요.');
  }, [error, showErrorToast]);

  const updateCache = (updater: (prev: GetNodeResponse) => GetNodeResponse) => {
    queryClient.setQueryData(
      nodeKeys.detail(projectId, nodeId),
      (old: GetNodeResponse | undefined) => (old ? updater(old) : old),
    );
  };

  const { mutate: updateTitle } = useUpdateNodeTitleMutation(projectId, nodeId);
  const { mutate: createSubNode } = useCreateSubNodeMutation(projectId);

  const handleTitleUpdate = (title: string) => {
    if (!nodeId || title === (nodeDetail?.title ?? '')) return;
    updateTitle(title, {
      onError: (err) => showErrorToast(err, '제목 수정에 실패했어요.'),
    });
  };

  const titleEditor = useTitleEditor(nodeDetail?.title, handleTitleUpdate);

  const handleDescriptionUpdate = (description: string) => {
    updateCache((prev) => ({ ...prev, description }));
  };

  const menuActions = useNodeMenuActions({
    nodeId: nodeId ?? 0,
    projectId,
    nodeTitle: nodeDetail?.title,
    nodeNumber: nodeDetail?.number,
    onDeleteSuccess,
  });

  if (isLoading) return <Loading />;

  const menuVariant = !nodeDetail?.parentId
    ? 'main'
    : nodeDetail?.meeting?.meetingId
      ? 'sub-with-meeting'
      : 'sub-without-meeting';

  return (
    <div className="flex h-full flex-col overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center justify-between pt-1 pr-2">
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

        <div className="flex items-center gap-3 py-0.5">
          <Users users={activeUsers} size="xsmall" />
          <NodeMenu
            variant={menuVariant}
            position="bottom-end"
            {...menuActions}
            onCreateSubNode={() => {
              if (!nodeId) return;
              createSubNode(nodeId, {
                onError: (err) => showErrorToast(err, '서브 노드 생성에 실패했어요.'),
              });
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-5">
        <EditorContent editor={titleEditor} />

        <div className="flex flex-col gap-5">
          <MetaRow icon={<IconTag />} label="태그">
            {nodeId && (
              <TagField projectId={projectId} nodeId={nodeId} initialTags={nodeDetail?.tags} />
            )}
          </MetaRow>

          <MetaRow icon={<IconPersons />} label="노드 담당자">
            {nodeId && (
              <AssigneeField
                projectId={projectId}
                nodeId={nodeId}
                initialAssignees={nodeDetail?.assignees}
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
            {nodeId && (
              <StatusField
                projectId={projectId}
                nodeId={nodeId}
                initialStatus={nodeDetail?.status as NodeStatusType | undefined}
              />
            )}
          </MetaRow>
        </div>

        {nodeDetail?.meeting?.meetingId && nodeDetail.meeting.status !== 'ENDED' ? (
          <a
            href={nodeDetail?.meeting?.meetingUrl}
            className="text-label-1-normal flex items-center justify-between rounded-lg border border-gray-200 p-3"
          >
            <div>{formatDatetoString(nodeDetail?.meeting?.startedAt)}에 회의 예정</div>
            <GoogleMeetIcon />
          </a>
        ) : (
          <></>
        )}
      </div>

      <Tab value={value} onValueChange={onValueChange} defaultValue="note">
        <TabList size="medium" resize="fill">
          {nodeDetail?.parentId && (
            <>
              <TabListItem value="note">노트</TabListItem>
              <TabListItem value="meeting">회의</TabListItem>
            </>
          )}
        </TabList>
        <TabPanel value="note">{noteContent}</TabPanel>
        <TabPanel value="meeting" sx={{ flex: 1 }}>
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
