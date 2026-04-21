'use client';

import {
  Avatar,
  Chip,
  Menu,
  MenuContent,
  MenuList,
  MenuTrigger,
  TextField,
  TextFieldButton,
} from '@wanteddev/wds';
import { IconChevronDownSmall, IconClose } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { ConfirmDialogContent } from '@/components/commons/custom-dialog/ConfirmDialogContent';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import { EXAMPLE_PROJECT_MEMBERS } from '@/constants/exampleConstant';
import { textFieldPrimaryFocusSx } from '@/styles/sx';

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

export const MembersSettingsPanel = () => {
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
        <ul className="hover:[&::-webkit-scrollbar-thumb]:bg-label-alternative/30 hover:[&::-webkit-scrollbar-thumb:hover]:bg-label-alternative/50 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto [scrollbar-color:transparent_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] hover:[scrollbar-color:color-mix(in_srgb,var(--color-label-alternative)_30%,transparent)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-track]:bg-transparent">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-4 rounded-md py-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <Avatar variant="person" size="medium" alt={member.name} />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-caption-1 text-label-normal truncate">{member.name}</span>
                  <span className="text-caption-2 text-label-alternative truncate">
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

MembersSettingsPanel.displayName = 'MembersSettingsPanel';
