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

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { useErrorToast } from '@/hooks/useErrorToast';
import { normalizeImageUrl } from '@/utils/normalizeImageUrl';
import {
  useDeleteMemberMutation,
  useInviteMemberMutation,
  useProjectMembersQuery,
  useUpdateMemberRoleMutation,
} from '@/queries/member';
import { cn } from '@/utils/cn';

import { MemberDeleteConfirmContent } from './MemberDeleteConfirmContent';
import type { ProjectMemberRole } from './SettingsModalContent';
import { useMemberInviteForm } from './useMemberInviteForm';

interface MemberRow {
  memberId: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  role: ProjectMemberRole;
}

const ROLE_LABEL_MAP: Record<ProjectMemberRole, string> = {
  OWNER: '관리자',
  MEMBER: '멤버',
  VIEWER: '뷰어',
};

const ASSIGNABLE_ROLES: readonly ProjectMemberRole[] = ['MEMBER', 'VIEWER'];

interface MembersSettingsPanelProps {
  projectId: number;
  myRole: ProjectMemberRole | null;
}

export const MembersSettingsPanel = ({ projectId, myRole }: MembersSettingsPanelProps) => {
  const { openDialog, closeDialog } = useDialog();
  const toast = usePositionedToast();
  const showErrorToast = useErrorToast();
  const {
    email,
    setEmail,
    pendingEmails,
    isCurrentInvalid,
    canSendAll,
    commitCurrent,
    removeEmail,
    buildPayloads,
    reset,
  } = useMemberInviteForm();

  const [openRoleMenuFor, setOpenRoleMenuFor] = useState<number | null>(null);

  const { data: rawMembers = [] } = useProjectMembersQuery(projectId);
  const inviteMemberMutation = useInviteMemberMutation(projectId);
  const updateMemberRoleMutation = useUpdateMemberRoleMutation(projectId);
  const deleteMemberMutation = useDeleteMemberMutation(projectId);

  const members: MemberRow[] = rawMembers
    .filter(
      (m): m is { memberId: number; role: ProjectMemberRole } & typeof m =>
        m.memberId !== undefined && m.role !== undefined,
    )
    .map((m) => ({
      memberId: m.memberId,
      nickname: m.nickname ?? '',
      email: m.email ?? '',
      profileImageUrl: m.profileImageUrl,
      role: m.role as ProjectMemberRole,
    }));

  const isViewer = myRole === 'VIEWER';
  const isOwner = myRole === 'OWNER';

  const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    commitCurrent();
  };

  const handleInviteSend = async () => {
    if (!canSendAll) return;
    const payloads = buildPayloads();
    if (payloads.length === 0) return;
    const results = await Promise.allSettled(
      payloads.map((payload) => inviteMemberMutation.mutateAsync(payload.email)),
    );
    const failures = results.filter((r) => r.status === 'rejected');
    const successCount = payloads.length - failures.length;
    reset();
    if (failures.length === 0) {
      toast({
        content: `${payloads.length}명에게 초대 메일을 전송했어요`,
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    } else {
      const firstReason = (failures[0] as PromiseRejectedResult).reason;
      showErrorToast(firstReason, `${successCount}명 전송 완료, ${failures.length}명 실패`);
    }
  };

  const handleRoleChange = async (member: MemberRow, nextRole: ProjectMemberRole) => {
    setOpenRoleMenuFor(null);
    if (member.role === nextRole) return;
    try {
      await updateMemberRoleMutation.mutateAsync({ memberId: member.memberId, role: nextRole });
      toast({
        content: '멤버 권한을 변경했어요',
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    } catch (caught) {
      showErrorToast(caught, '멤버 권한 변경에 실패했어요.');
    }
  };

  const handleMemberDelete = (member: MemberRow) => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <MemberDeleteConfirmContent
          memberName={member.nickname || member.email}
          onConfirm={async () => {
            try {
              await deleteMemberMutation.mutateAsync(member.memberId);
              closeDialog();
              toast({
                content: '멤버를 삭제했어요',
                variant: 'normal',
                placement: 'bottom-left',
                duration: 'short',
              });
            } catch (caught) {
              showErrorToast(caught, '멤버 삭제에 실패했어요.');
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* 멤버 초대 */}
      <div className="flex flex-col gap-2">
        <span className="text-label-1 text-label-neutral font-normal">멤버 초대</span>
        <TextField
          id="project-settings-invite-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={handleEmailKeyDown}
          width="100%"
          placeholder="이메일 주소를 입력하고 Enter 로 추가"
          invalid={isCurrentInvalid}
          trailingButton={
            <TextFieldButton
              variant="normal"
              onClick={handleInviteSend}
              disabled={!canSendAll}
              aria-label="멤버 초대 전송"
            >
              전송
            </TextFieldButton>
          }
        />

        {pendingEmails.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {pendingEmails.map((mail) => (
              <Chip
                key={mail}
                size="medium"
                variant="solid"
                disableInteraction
                leadingContent={<Avatar variant="person" size="xsmall" alt={mail} />}
                trailingContent={
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      removeEmail(mail);
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        event.stopPropagation();
                        removeEmail(mail);
                      }
                    }}
                    aria-label={`${mail} 초대 취소`}
                    className="text-label-alternative hover:text-label-neutral relative z-10 flex h-4 w-4 cursor-pointer items-center justify-center"
                  >
                    <IconClose className="h-4 w-4" aria-hidden="true" />
                  </span>
                }
              >
                <span className="text-caption-1 text-label-alternative font-medium">{mail}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* 멤버 목록 */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <span className="text-label-1 text-label-neutral font-normal">멤버 목록</span>
        <ul className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-2">
          {members.map((member) => {
            const rowIsOwner = member.role === 'OWNER';
            const showRoleDropdown = !isViewer && !rowIsOwner;
            const showDeleteButton = isOwner && !rowIsOwner;
            return (
              <li
                key={member.memberId}
                className="flex items-center justify-between gap-4 rounded-md py-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    variant="person"
                    size="small"
                    src={normalizeImageUrl(member.profileImageUrl)}
                    alt={member.nickname || member.email}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="text-body-1 text-label-normal truncate font-medium">
                      {member.nickname || '이름 없음'}
                    </span>
                    <span className="text-caption-1 text-label-alternative truncate">
                      {member.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {showRoleDropdown ? (
                    <Menu
                      open={openRoleMenuFor === member.memberId}
                      onOpenChange={(isOpen) => setOpenRoleMenuFor(isOpen ? member.memberId : null)}
                    >
                      <MenuTrigger>
                        <button
                          type="button"
                          className={cn(
                            'text-caption-1 text-label-neutral hover:bg-fill-normal active:bg-fill-strong inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 font-medium transition-colors outline-none',
                            'focus-visible:ring-primary-40 focus-visible:ring-2 focus-visible:ring-offset-2',
                          )}
                        >
                          {ROLE_LABEL_MAP[member.role]}
                          <IconChevronDownSmall className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </MenuTrigger>
                      <MenuContent
                        offset={4}
                        position="bottom-end"
                        sx={{ width: '8rem', zIndex: 10000 }}
                      >
                        <MenuList>
                          {ASSIGNABLE_ROLES.map((role) => (
                            <CustomMenuItem
                              key={role}
                              value={role}
                              onClick={() => handleRoleChange(member, role)}
                            >
                              {ROLE_LABEL_MAP[role]}
                            </CustomMenuItem>
                          ))}
                        </MenuList>
                      </MenuContent>
                    </Menu>
                  ) : (
                    <span className="text-caption-1 text-label-neutral font-medium">
                      {ROLE_LABEL_MAP[member.role]}
                    </span>
                  )}
                  {showDeleteButton && (
                    <button
                      type="button"
                      onClick={() => handleMemberDelete(member)}
                      className={cn(
                        'text-caption-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong rounded-md bg-transparent px-2 py-1 font-semibold transition-colors outline-none',
                        'focus-visible:ring-primary-40 focus-visible:ring-2 focus-visible:ring-offset-2',
                      )}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

MembersSettingsPanel.displayName = 'MembersSettingsPanel';
