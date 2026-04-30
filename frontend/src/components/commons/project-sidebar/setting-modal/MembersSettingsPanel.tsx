'use client';

import {
  Avatar,
  Menu,
  MenuContent,
  MenuList,
  MenuTrigger,
  TextField,
  TextFieldButton,
} from '@wanteddev/wds';
import { IconChevronDownSmall } from '@wanteddev/wds-icon';
import { useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { cn } from '@/utils/cn';

import { ProjectDeleteConfirmContent } from './ProjectDeleteConfirmContent';
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
  // OWNER 는 표시 라벨만 "관리자" 로 사용. 백엔드 enum 값은 그대로 OWNER 유지.
  OWNER: '관리자',
  MEMBER: '멤버',
  VIEWER: '뷰어',
};

/** 일반 멤버에게 변경 가능한 권한 옵션. OWNER 양도는 정책 미정으로 본 PR 범위 밖. */
const ASSIGNABLE_ROLES: readonly ProjectMemberRole[] = ['MEMBER', 'VIEWER'];

interface MembersSettingsPanelProps {
  projectId: number;
  /** 부모(`SettingsModalContent`)에서 한 번 받아 내려주는 현재 사용자의 권한. */
  myRole: ProjectMemberRole | null;
}

/**
 * 설정 모달 - 구성원 탭.
 *
 * 권한 분기:
 * - OWNER  : 모든 멤버 행에 권한 드롭다운 + 삭제 버튼 (해당 행이 OWNER 면 둘 다 X).
 * - MEMBER : 권한 드롭다운만 표시(권한 변경은 가능), 삭제 버튼 미노출.
 * - VIEWER : 권한 드롭다운/삭제 모두 미노출. 라벨만 표시.
 *
 * 그 외:
 * - 멤버 목록: `getAllMembers(projectId)` → `MemberRow` 정규화.
 * - 멤버 초대: `useMemberInviteForm` + `inviteMember(projectId, { email })`.
 * - 권한 변경: WDS Menu + CustomMenuItem → `updateMemberRole(projectId, memberId, { role })`.
 *   드롭다운이 모달(z-9999) 뒤로 빠지지 않도록 `MenuContent.sx.zIndex` 명시.
 * - 멤버 삭제: 컨펌 다이얼로그 → `deleteMember(projectId, memberId)`.
 * - 멤버 목록 스크롤바: `globals.css` 의 `.custom-scrollbar` 유틸 사용.
 */
export const MembersSettingsPanel = ({ projectId, myRole }: MembersSettingsPanelProps) => {
  const { openDialog, closeDialog } = useDialog();
  const toast = usePositionedToast();
  const { email, setEmail, isInvalid, canSend, buildPayload, reset } = useMemberInviteForm();

  const [members, setMembers] = useState<MemberRow[]>([]);
  const [openRoleMenuFor, setOpenRoleMenuFor] = useState<number | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);
  const triggerReload = () => setReloadCounter((c) => c + 1);

  const isViewer = myRole === 'VIEWER';
  const isOwner = myRole === 'OWNER';

  useEffect(() => {
    let cancelled = false;
    const fetchMembers = async () => {
      try {
        const response = await privateApi.projectMember.getAllMembers(projectId);
        if (cancelled) return;
        const list = response.data.data?.members ?? [];
        const normalized: MemberRow[] = list
          .filter(
            (m): m is { memberId: number; role: ProjectMemberRole } & typeof m =>
              m.memberId !== undefined && m.role !== undefined,
          )
          .map((m) => ({
            memberId: m.memberId,
            nickname: m.nickname ?? '',
            email: m.email ?? '',
            profileImageUrl: m.profileImageUrl,
            role: m.role,
          }));
        setMembers(normalized);
      } catch (caught) {
        if (cancelled) return;
        console.error('멤버 목록 조회에 실패했어요.', caught);
      }
    };
    void fetchMembers();
    return () => {
      cancelled = true;
    };
  }, [projectId, reloadCounter]);

  const handleInviteSend = async () => {
    if (!canSend) return;
    try {
      await privateApi.project.inviteMember(projectId, buildPayload());
      reset();
      toast({
        content: '초대 메일을 전송했어요',
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    } catch (caught) {
      console.error('멤버 초대에 실패했어요.', caught);
    }
  };

  const handleRoleChange = async (member: MemberRow, nextRole: ProjectMemberRole) => {
    setOpenRoleMenuFor(null);
    if (member.role === nextRole) return;
    try {
      await privateApi.projectMember.updateMemberRole(projectId, member.memberId, {
        role: nextRole,
      });
      triggerReload();
      toast({
        content: '멤버 권한을 변경했어요',
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    } catch (caught) {
      console.error('멤버 권한 변경에 실패했어요.', caught);
    }
  };

  const handleMemberDelete = (member: MemberRow) => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ProjectDeleteConfirmContent
          projectName={member.nickname || member.email}
          onConfirm={async () => {
            try {
              await privateApi.projectMember.deleteMember(projectId, member.memberId);
              closeDialog();
              triggerReload();
              toast({
                content: '멤버를 삭제했어요',
                variant: 'normal',
                placement: 'bottom-left',
                duration: 'short',
              });
            } catch (caught) {
              console.error('멤버 삭제에 실패했어요.', caught);
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
          width="100%"
          placeholder="초대할 이메일 주소"
          invalid={isInvalid}
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
                    src={member.profileImageUrl}
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
                      onOpenChange={(isOpen) =>
                        setOpenRoleMenuFor(isOpen ? member.memberId : null)
                      }
                    >
                      <MenuTrigger>
                        <button
                          type="button"
                          className={cn(
                            'text-caption-1 text-label-neutral hover:bg-fill-normal active:bg-fill-strong inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 font-medium outline-none transition-colors',
                            'focus-visible:ring-primary-40 focus-visible:ring-2 focus-visible:ring-offset-2',
                          )}
                        >
                          {ROLE_LABEL_MAP[member.role]}
                          <IconChevronDownSmall className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </MenuTrigger>
                      {/* WDS Menu 기본 z-index(11) < 공통 모달(9999). 모달 뒤로 빠지지 않도록 명시. */}
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
                        'text-caption-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors',
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
