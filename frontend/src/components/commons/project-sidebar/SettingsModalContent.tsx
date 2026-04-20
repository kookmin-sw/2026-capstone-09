'use client';

import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  Menu,
  MenuContent,
  MenuList,
  MenuTrigger,
  Switch,
  TextButton,
  TextField,
  TextFieldButton,
  TextFieldContent,
} from '@wanteddev/wds';
import {
  IconBell,
  IconChevronDownSmall,
  IconClose,
  IconFolder,
  IconPersons,
  IconTrash,
} from '@wanteddev/wds-icon';
import { ChangeEvent, ComponentType, SVGProps, useEffect, useRef, useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import {
  EXAMPLE_PROJECT_MEMBERS,
  EXAMPLE_PROJECT_NOTIFICATION_SETTINGS,
  EXAMPLE_PROJECT_SETTINGS,
} from '@/constants/exampleConstant';
import { cn } from '@/utils/cn';

import { ConfirmDialogContent } from './ConfirmDialogContent';

// WDS TextField 포커스 테두리·캐럿 색을 FlowMeet Primary 토큰으로 스코프드 오버라이드
const textFieldPrimaryFocusSx = {
  '&:has(input:focus) [data-role="text-field-wrapper"]': {
    boxShadow:
      'inset 0 0 0 2px color-mix(in srgb, var(--color-primary-40) 43%, transparent) !important',
  },
  '[data-role="text-field-wrapper"] input': {
    caretColor: 'var(--color-primary-40)',
  },
} as const;

type SettingsTab = 'project' | 'members' | 'notifications';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const TABS: readonly TabItem[] = [
  { id: 'project', label: '프로젝트', icon: IconFolder },
  { id: 'members', label: '구성원', icon: IconPersons },
  { id: 'notifications', label: '알림', icon: IconBell },
];

const TAB_TITLE_MAP: Record<SettingsTab, string> = {
  project: '프로젝트 설정',
  members: '멤버 설정',
  notifications: '알림 설정',
};

// =============================================================
// Sidebar: 탭 리스트
// =============================================================
interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SettingsSidebarNav = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <h3 className="text-caption-1 text-static-black font-semibold">설정</h3>
      <nav className="flex flex-col gap-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-md border-none bg-transparent p-0 py-2 text-left',
                'text-label-neutral hover:text-label-normal',
                isActive && 'text-label-normal font-medium',
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6 shrink-0',
                  isActive ? 'text-label-normal' : 'text-label-alternative',
                )}
                aria-hidden="true"
              />
              <span className="text-body-1 flex-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// =============================================================
// 프로젝트 삭제 확인 다이얼로그 (이름 입력형)
// =============================================================
interface ProjectDeleteConfirmContentProps {
  projectName: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ProjectDeleteConfirmContent = ({
  projectName,
  onConfirm,
  onClose,
}: ProjectDeleteConfirmContentProps) => {
  const [nameInput, setNameInput] = useState('');
  const canDelete = nameInput.trim() === projectName.trim() && projectName.trim().length > 0;

  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-heading-2 text-label-normal flex-1 font-semibold">
          프로젝트를 삭제하시겠어요?
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-label-alternative hover:text-label-neutral flex h-6 w-6 shrink-0 items-center justify-center border-none bg-transparent p-0"
        >
          <IconClose className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <p className="text-body-2 text-label-alternative whitespace-pre-line">
        프로젝트를 삭제하시면 복구할 수 없으며, 모든 정보가 영구적으로 사라져요. 계속 진행하려면
        프로젝트 이름을 입력해 주세요.
      </p>
      <TextField
        id="project-delete-confirm-name"
        value={nameInput}
        onChange={(event) => setNameInput(event.target.value)}
        placeholder={projectName}
        width="100%"
        sx={textFieldPrimaryFocusSx}
      />
      <Button
        variant="solid"
        color="primary"
        size="medium"
        fullWidth
        disabled={!canDelete}
        onClick={onConfirm}
        sx={
          canDelete
            ? {
                backgroundColor: 'var(--color-status-negative) !important',
                color: 'var(--color-static-white) !important',
                '&:hover, &:focus-visible': {
                  backgroundColor:
                    'color-mix(in srgb, var(--color-status-negative) 88%, black) !important',
                },
                '&:active': {
                  backgroundColor:
                    'color-mix(in srgb, var(--color-status-negative) 78%, black) !important',
                },
              }
            : undefined
        }
      >
        프로젝트 삭제하기
      </Button>
    </div>
  );
};

// =============================================================
// 프로젝트 탭
// =============================================================
const ProjectSettingsPanel = () => {
  const { openDialog, closeDialog } = useDialog();
  const [projectName, setProjectName] = useState<string>(EXAMPLE_PROJECT_SETTINGS.projectName);
  const [projectPreviewUrl, setProjectPreviewUrl] = useState<string | undefined>(undefined);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleDeleteProjectClick = () => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ProjectDeleteConfirmContent
          projectName={projectName}
          onConfirm={closeDialog}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleProjectImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setProjectPreviewUrl(url);
    event.target.value = '';
  };

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-8">
          <label
            htmlFor="project-settings-image"
            aria-label="프로젝트 이미지 변경"
            className="group relative inline-flex shrink-0 cursor-pointer overflow-hidden rounded-3xl"
          >
            <Avatar variant="company" size={84} src={projectPreviewUrl} alt={projectName} />
            <span
              aria-hidden="true"
              className="bg-label-normal/0 group-hover:bg-label-normal/20 pointer-events-none absolute inset-0 rounded-3xl transition-colors duration-150"
            />
            <input
              id="project-settings-image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleProjectImageChange}
            />
          </label>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label
              htmlFor="project-settings-name"
              className="text-label-1 text-label-neutral font-semibold"
            >
              이름
            </label>
            <TextField
              id="project-settings-name"
              value={projectName}
              maxLength={EXAMPLE_PROJECT_SETTINGS.nameMaxLength}
              onChange={(event) => setProjectName(event.target.value)}
              width="100%"
              sx={textFieldPrimaryFocusSx}
              trailingContent={
                <TextFieldContent variant="text">
                  <span className="text-caption-1 text-label-alternative/75 font-medium">
                    {projectName.length}/{EXAMPLE_PROJECT_SETTINGS.nameMaxLength}
                  </span>
                </TextFieldContent>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-label-1 text-label-alternative font-medium">
            구성원 수: {EXAMPLE_PROJECT_SETTINGS.memberCount}명
          </p>
          <p className="text-label-1 text-label-alternative font-medium">
            프로젝트 생성일: {EXAMPLE_PROJECT_SETTINGS.createdAt}
          </p>
        </div>
      </div>

      <div>
        <TextButton
          size="small"
          color="assistive"
          onClick={handleDeleteProjectClick}
          leadingContent={
            <IconTrash className="text-status-negative h-4 w-4" aria-hidden="true" />
          }
          sx={{
            color: 'var(--color-status-negative) !important',
            '&:hover, &:focus-visible, &:active': {
              color: 'var(--color-status-negative) !important',
            },
          }}
        >
          프로젝트 삭제
        </TextButton>
      </div>
    </div>
  );
};

// =============================================================
// 멤버 탭
// =============================================================
interface MemberRow {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ROLE_LABEL_MAP: Record<string, string> = {
  admin: '관리자',
  member: '멤버',
};

const MembersSettingsPanel = () => {
  const { openDialog, closeDialog } = useDialog();
  const [inviteInput, setInviteInput] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<readonly string[]>([
    'sinji1012@kookmin.ac.kr',
    '황수민',
  ]);
  const [members, setMembers] = useState<MemberRow[]>(() =>
    EXAMPLE_PROJECT_MEMBERS.map((member) => ({ ...member })),
  );

  const handleRoleChange = (memberId: string, nextRole: 'admin' | 'member') => {
    setMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, role: nextRole } : member)),
    );
  };

  const handleMemberDelete = (member: MemberRow) => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ConfirmDialogContent
          title="멤버 삭제"
          description={`${member.name}님을 이 프로젝트에서 제외할까요?\n제외된 멤버는 다시 초대해야 접근할 수 있어요.`}
          leftButton={{
            label: '삭제',
            tone: 'negative',
            onClick: () => {
              closeDialog();
              setMembers((prev) => prev.filter((item) => item.id !== member.id));
            },
          }}
          rightButton={{
            label: '취소',
            tone: 'assistive',
            onClick: closeDialog,
          }}
        />
      ),
    });
  };

  const canSend = inviteInput.trim().length > 0;

  const handleInviteSend = () => {
    const trimmed = inviteInput.trim();
    if (!trimmed) return;
    setInvitedEmails((prev) => [...prev, trimmed]);
    setInviteInput('');
  };

  const handleInviteRemove = (email: string) => {
    setInvitedEmails((prev) => prev.filter((item) => item !== email));
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* 멤버 초대 */}
      <div className="flex flex-col gap-2">
        <span className="text-label-1 text-label-neutral font-normal">멤버 초대</span>
        <TextField
          id="project-settings-invite-email"
          type="email"
          value={inviteInput}
          onChange={(event) => setInviteInput(event.target.value)}
          width="100%"
          placeholder="이메일 또는 이름"
          sx={textFieldPrimaryFocusSx}
          trailingButton={
            <TextFieldButton
              variant="normal"
              onClick={handleInviteSend}
              disabled={!canSend}
              aria-label="멤버 초대 전송"
            >
              전송
            </TextFieldButton>
          }
        />
        {invitedEmails.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {invitedEmails.map((email) => (
              <Chip
                key={email}
                size="medium"
                variant="solid"
                disableInteraction
                leadingContent={<Avatar variant="person" size="xsmall" alt={email} />}
                trailingContent={
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleInviteRemove(email);
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        event.stopPropagation();
                        handleInviteRemove(email);
                      }
                    }}
                    aria-label={`${email} 초대 취소`}
                    className="text-label-alternative hover:text-label-neutral relative z-10 flex h-4 w-4 cursor-pointer items-center justify-center"
                  >
                    <IconClose className="h-4 w-4" aria-hidden="true" />
                  </span>
                }
              >
                <span className="text-caption-1 text-label-alternative font-medium">{email}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* 멤버 목록 */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <span className="text-label-1 text-label-neutral font-normal">멤버 목록</span>
        <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto [scrollbar-color:transparent_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] hover:[scrollbar-color:color-mix(in_srgb,var(--color-label-alternative)_30%,transparent)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 hover:[&::-webkit-scrollbar-thumb]:bg-label-alternative/30 hover:[&::-webkit-scrollbar-thumb:hover]:bg-label-alternative/50">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-4 rounded-md py-2"
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <Avatar variant="person" size="medium" alt={member.name} />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-caption-1 text-label-normal truncate">{member.name}</span>
                  <span className="text-label-alternative truncate text-[0.625rem] leading-[0.875rem]">
                    {member.email}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <Menu
                  value={member.role}
                  onValueChange={(nextValue) => {
                    if (typeof nextValue !== 'string') return;
                    if (nextValue === 'admin' || nextValue === 'member') {
                      handleRoleChange(member.id, nextValue);
                    }
                  }}
                >
                  <MenuTrigger>
                    <button
                      type="button"
                      className="text-caption-1 text-label-neutral hover:text-label-normal flex items-center gap-1.5 border-none bg-transparent p-0"
                      aria-label={`${member.name} 권한 변경`}
                    >
                      <span>{ROLE_LABEL_MAP[member.role] ?? '멤버'}</span>
                      <IconChevronDownSmall
                        className="text-label-normal h-3 w-3"
                        aria-hidden="true"
                      />
                    </button>
                  </MenuTrigger>
                  <MenuContent position="bottom-end" sx={{ width: '7rem', zIndex: 10000 }}>
                    <MenuList>
                      <CustomMenuItem value="member">멤버</CustomMenuItem>
                      <CustomMenuItem value="admin">관리자</CustomMenuItem>
                    </MenuList>
                  </MenuContent>
                </Menu>
                <button
                  type="button"
                  onClick={() => handleMemberDelete(member)}
                  className="text-caption-1 text-status-negative hover:text-status-negative/80 border-none bg-transparent p-0"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// =============================================================
// 알림 탭
// =============================================================
interface NotificationRowProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const NotificationRow = ({ label, checked, onCheckedChange }: NotificationRowProps) => {
  return (
    <div className="flex w-40 items-center justify-between gap-2 py-3">
      <span className="text-label-1 text-label-normal">{label}</span>
      <Switch
        size="small"
        checked={checked}
        onCheckedChange={onCheckedChange}
        sx={{
          '&[data-checked="true"]': {
            backgroundColor: 'var(--color-primary-40) !important',
          },
        }}
      />
    </div>
  );
};

const NotificationsSettingsPanel = () => {
  const [meetingEnabled, setMeetingEnabled] = useState<boolean>(
    EXAMPLE_PROJECT_NOTIFICATION_SETTINGS.meetingEnabled,
  );
  const [nodeEnabled, setNodeEnabled] = useState<boolean>(
    EXAMPLE_PROJECT_NOTIFICATION_SETTINGS.nodeEnabled,
  );
  const [desktopEnabled, setDesktopEnabled] = useState<boolean>(
    EXAMPLE_PROJECT_NOTIFICATION_SETTINGS.channels.desktop,
  );
  const [emailEnabled, setEmailEnabled] = useState<boolean>(
    EXAMPLE_PROJECT_NOTIFICATION_SETTINGS.channels.email,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <NotificationRow
          label="회의 알림"
          checked={meetingEnabled}
          onCheckedChange={setMeetingEnabled}
        />
        <NotificationRow
          label="노드 알림"
          checked={nodeEnabled}
          onCheckedChange={setNodeEnabled}
        />
      </div>

      <div aria-hidden="true" className="bg-line-normal-normal h-px w-full" />

      <div className="flex items-center gap-10">
        <span className="text-label-1 text-static-black">알림 수신 방법</span>
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 py-3">
            <Checkbox
              size="small"
              checked={desktopEnabled}
              onCheckedChange={setDesktopEnabled}
              tight
            />
            <span className="text-caption-1 text-label-normal">데스크톱</span>
          </label>
          <label className="flex items-center gap-2 py-3">
            <Checkbox
              size="small"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
              tight
            />
            <span className="text-caption-1 text-label-normal">이메일</span>
          </label>
        </div>
      </div>
    </div>
  );
};

// =============================================================
// Wrapper (Sidebar + Content)
// =============================================================
interface SettingsModalContentProps {
  onClose: () => void;
}

export const SettingsModalContent = ({ onClose }: SettingsModalContentProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('project');

  return (
    // Modal default variant(`p-12`) 의 외곽 패딩을 -m-12로 상쇄하고 내부에서
    // 사이드바(왼쪽 gray) + 본문(오른쪽) 구조를 직접 배치한다.
    <div className="-m-12 flex h-144 items-stretch gap-8 pr-12">
      <aside className="bg-background-normal-alternative w-50 shrink-0 overflow-hidden p-6">
        <SettingsSidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      <section className="flex min-h-0 flex-1 flex-col gap-8 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-1 text-label-normal font-medium">
            {TAB_TITLE_MAP[activeTab]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
          >
            <IconClose className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex min-h-0 flex-1 flex-col">
          {activeTab === 'project' && <ProjectSettingsPanel />}
          {activeTab === 'members' && <MembersSettingsPanel />}
          {activeTab === 'notifications' && <NotificationsSettingsPanel />}
        </div>
      </section>
    </div>
  );
};

SettingsModalContent.displayName = 'SettingsModalContent';
