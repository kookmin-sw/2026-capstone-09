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
import { EXAMPLE_NODE_DETAIL, EXAMPLE_USERS } from '@/constants/exampleConstant';
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
import { EditorContent, } from '@tiptap/react';
import { useTitleEditor } from './hooks/useTitleEditor';

interface NodeDetailLayoutProps {
  nodeId: string | null;
  noteContent: React.ReactNode;
  meetingContent: React.ReactNode;
  value?: string;
  onValueChange?: (tab: string) => void;
}

export function NodeDetailLayout({
  nodeId,
  noteContent,
  meetingContent,
  value, // 외부에서 탭 상태 주입
  onValueChange, // 외부에서 탭 변경 핸들링
}: NodeDetailLayoutProps) {
  const nodeDetail = EXAMPLE_NODE_DETAIL;
  const titleEditor = useTitleEditor(nodeDetail.title);

  return (
    <div className="flex h-full flex-col">
      {/* 태그, 프로필, 타코볼 */}
      <div className="flex items-center justify-between">
        {nodeDetail.parentId ? ( // 메인 노드 / 서브 노드 분기
          <ContentBadge color="neutral" size="xsmall" variant="outlined">
            #{nodeDetail.number}
          </ContentBadge>
        ) : (
          <ContentBadge
            className="!bg-primary-40/10 !text-primary-40"
            size="xsmall"
            variant="solid"
          >
            #{nodeDetail.number}
          </ContentBadge>
        )}

        <div className="flex items-center gap-1 py-0.5">
          {/* TODO : 현재 디자인이랑 불일치해서 디자인에 맞출 건지 확인 필요 */}
          <Users users={EXAMPLE_USERS} />
          <IconMoreVertical />
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-5">
        {/* 제목 */}
        {/* TODO : 현재 타이포라서 read만 가능한 상태 - 나중에 input 변경 */}
        <EditorContent editor={titleEditor} />

        <div className="flex flex-col gap-5">
          {/* 태그 */}
          <MetaRow icon={<IconTag />} label="태그">
            <div className="flex flex-wrap gap-1.5">
              {nodeDetail.tags.map((tag) => (
                <span key={tag.tagId}>
                  {/* TODO : 서버에서 뱃지 색 color ENUM값으로 넘겨줘야 해서 형식 보고 + 매핑하고 추후 수정 */}
                  <ContentBadge size="xsmall">{tag.name}</ContentBadge>
                </span>
              ))}
            </div>
          </MetaRow>

          {/* 노드 담당자 */}
          <MetaRow icon={<IconPersons />} label="노드 담당자">
            <div className="flex gap-3">
              {nodeDetail.assignees.map((assingee) => (
                <div key={assingee.userId} className="flex items-center gap-1">
                  <div className="scale-75">
                    <Avatar
                      variant="person"
                      size="xsmall"
                      src={assingee.profileImageUrl || undefined}
                    />
                  </div>
                  <Typography variant="label1">{assingee.nickname}</Typography>
                </div>
              ))}
            </div>
          </MetaRow>

          {/* 노드 설명 */}
          <MetaRow icon={<IconDocumentText />} label="노드 설명">
            <div className="flex">
              <Typography variant="label1">{nodeDetail.noteContent}</Typography>
            </div>
          </MetaRow>

          {/* 진행 상태 */}
          <MetaRow icon={<IconFire />} label="진행 상태">
            <ContentBadge
              size="xsmall"
              color="accent"
              accentColor={
                getNodeStatusColor(nodeDetail.status as NodeStatusType) as ThemeColorsToken
              }
              leadingContent={getNodeStatusIcon(nodeDetail.status as NodeStatusType)}
            >
              {getNodeStatusLabel(nodeDetail.status as NodeStatusType)}
            </ContentBadge>
          </MetaRow>
        </div>

        {/* TODO : 회의가 있을 경우 회의 내용 필요 */}
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
