import {
  Avatar,
  ContentBadge,
  Tab,
  TabList,
  TabListItem,
  TabPanel,
  ThemeColorsToken,
  Typography,
} from '@wanteddev/wds';
import { EXAMPLE_USERS } from '@/constants/exampleConstant';
import { Users } from '../commons/user/UserAvatarGroup';
import {
  IconDocumentText,
  IconFire,
  IconMoreVertical,
  IconPersons,
  IconTag,
} from '@wanteddev/wds-icon';
import {
  getNodeStatusColor,
  getNodeStatusIcon,
  getNodeStatusLabel,
} from '@/constants/getNodeStatus';
import { NodeStatusType } from '@/constants/nodeStatus';
import { EditorContent } from '@tiptap/react';
import { useTitleEditor } from './hooks/useTitleEditor';
import { useEffect, useState } from 'react';
import { privateApi } from '@/api';
import { GetNodeResponse } from '@/api/Api';

interface Tag {
  tagId: number;
  name: string;
}

interface Assignee {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

interface NodeDetail {
  title: string;
  number: number;
  parentId: number | null;
  tags: Tag[];
  assignees: Assignee[];
  noteContent: string;
  status: NodeStatusType;
}

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
  const titleEditor = useTitleEditor(nodeDetail?.title);

  useEffect(() => {
    const fetchNodeDetail = async () => {
      try {
        const data = await privateApi.node.getNode(projectId, nodeId);
        setNodeDetail(data.data.data);
      } catch (error) {
        console.error('Failed to load flowchart:', error);
      }
    };
    void fetchNodeDetail();
  }, [nodeId]);

  return (
    <div className="flex h-full flex-col">
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
            <div className="flex flex-wrap gap-1.5">
              {nodeDetail?.tags?.map((tag) => (
                <span key={tag.tagId}>
                  <ContentBadge size="xsmall">{tag.name}</ContentBadge>
                </span>
              ))}
            </div>
          </MetaRow>

          <MetaRow icon={<IconPersons />} label="노드 담당자">
            <div className="flex gap-3">
              {nodeDetail?.assignees?.map((assignee) => (
                <div key={assignee.userId} className="flex items-center gap-1">
                  <div className="scale-75">
                    <Avatar
                      variant="person"
                      size="xsmall"
                      src={assignee.profileImageUrl || undefined}
                    />
                  </div>
                  <Typography variant="label1">{assignee.nickname}</Typography>
                </div>
              ))}
            </div>
          </MetaRow>

          <MetaRow icon={<IconDocumentText />} label="노드 설명">
            <div className="flex">
              <Typography variant="label1">{nodeDetail?.description}</Typography>
            </div>
          </MetaRow>

          <MetaRow icon={<IconFire />} label="진행 상태">
            <ContentBadge
              size="xsmall"
              color="accent"
              accentColor={
                getNodeStatusColor(nodeDetail?.status as NodeStatusType) as ThemeColorsToken
              }
              leadingContent={getNodeStatusIcon(nodeDetail?.status as NodeStatusType)}
            >
              {getNodeStatusLabel(nodeDetail?.status as NodeStatusType)}
            </ContentBadge>
          </MetaRow>
        </div>
      </div>

      <Tab value={value} onValueChange={onValueChange} defaultValue="note">
        <TabList size="medium" resize="fill">
          <TabListItem value="note">노트</TabListItem>
          <TabListItem value="meeting">회의</TabListItem>
        </TabList>
        <TabPanel value="note">{noteContent}</TabPanel>
        <TabPanel value="meeting">{meetingContent}</TabPanel>
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
      <div>{children}</div>
    </div>
  );
}
