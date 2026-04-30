'use client';

import { TextField, TextFieldContent } from '@wanteddev/wds';
import { IconLogout, IconTrash } from '@wanteddev/wds-icon';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';

import { ProjectDeleteConfirmContent } from './ProjectDeleteConfirmContent';
import { ProjectLeaveConfirmContent } from './ProjectLeaveConfirmContent';
import type { ProjectMemberRole } from './SettingsModalContent';
import { useProjectInfoForm } from './useProjectInfoForm';

interface ProjectSettingsPanelProps {
  projectId: number;
  /** 부모(`SettingsModalContent`)에서 한 번 받아 내려주는 현재 사용자의 권한. */
  myRole: ProjectMemberRole | null;
  /** 모달을 닫는 함수. 프로젝트 삭제·나가기 등 모달 자체를 닫을 때 사용한다. */
  onSettingsClose: () => void;
}

interface ProjectInfo {
  name: string;
  memberCount: number;
  createdAt: string;
}

const formatCreatedAt = (raw?: string): string => {
  if (!raw) return '-';
  try {
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  } catch {
    return raw;
  }
};

const AUTO_SAVE_DEBOUNCE_MS = 1000;

/**
 * 설정 모달 - 프로젝트 탭.
 *
 * 권한 분기:
 * - 소유자(OWNER)만 이름 변경, 프로젝트 삭제 가능.
 * - 소유자 외(MEMBER/VIEWER)는 이름 입력 비활성, 하단 액션은 "프로젝트 나가기"로 노출.
 *
 * 그 외:
 * - 마운트 시 `privateApi.project.getProject` 로 이름·멤버 수·생성일 표시.
 * - 이름은 별도 저장 버튼 없이 1초 debounce 후 자동 저장(`updateProject`).
 * - 프로젝트 삭제는 컨펌 다이얼로그 → `deleteProject` → `/projects` 이동.
 * - 프로젝트 나가기는 단순 `leaveProject` → `/projects` 이동.
 */
export const ProjectSettingsPanel = ({
  projectId,
  myRole,
  onSettingsClose,
}: ProjectSettingsPanelProps) => {
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const toast = usePositionedToast();

  const [info, setInfo] = useState<ProjectInfo | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);
  const triggerReload = () => setReloadCounter((c) => c + 1);

  const isOwner = myRole === 'OWNER';
  const canEditName = isOwner;

  const { name, setName, canSave, maxLength } = useProjectInfoForm({
    initialName: info?.name ?? '',
  });

  useEffect(() => {
    let cancelled = false;
    const fetchInfo = async () => {
      try {
        const response = await privateApi.project.getProject(projectId);
        if (cancelled) return;
        const data = response.data.data;
        setInfo({
          name: data?.name ?? '',
          memberCount: data?.memberCount ?? 0,
          createdAt: formatCreatedAt(data?.createdAt),
        });
      } catch (caught) {
        if (cancelled) return;
        console.error('프로젝트 상세 조회에 실패했어요.', caught);
      }
    };
    void fetchInfo();
    return () => {
      cancelled = true;
    };
  }, [projectId, reloadCounter]);

  // 이름 자동 저장: OWNER 권한 + 마지막 입력 후 1초가 지나면 updateProject 호출.
  useEffect(() => {
    if (!canEditName || !canSave) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      const saveName = async () => {
        try {
          await privateApi.project.updateProject(projectId, { name: name.trim() });
          if (cancelled) return;
          triggerReload();
          toast({
            content: '프로젝트 이름을 수정했어요',
            variant: 'normal',
            placement: 'bottom-left',
            duration: 'short',
          });
        } catch (caught) {
          if (cancelled) return;
          console.error('프로젝트 이름 수정에 실패했어요.', caught);
        }
      };
      void saveName();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [name, canSave, canEditName, projectId, toast]);

  const handleDeleteProjectClick = () => {
    if (!info) return;
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ProjectDeleteConfirmContent
          projectName={info.name}
          onConfirm={async () => {
            try {
              await privateApi.project.deleteProject(projectId);
              closeDialog();
              onSettingsClose();
              router.push('/projects');
              toast({
                content: '프로젝트를 삭제했어요',
                variant: 'normal',
                placement: 'bottom-left',
                duration: 'short',
              });
            } catch (caught) {
              console.error('프로젝트 삭제에 실패했어요.', caught);
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleLeaveProjectClick = () => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ProjectLeaveConfirmContent
          onConfirm={async () => {
            try {
              await privateApi.projectMember.leaveProject(projectId);
              closeDialog();
              onSettingsClose();
              router.push('/projects');
              toast({
                content: '프로젝트에서 나갔어요',
                variant: 'normal',
                placement: 'bottom-left',
                duration: 'short',
              });
            } catch (caught) {
              console.error('프로젝트 나가기에 실패했어요.', caught);
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label
            htmlFor="project-settings-name"
            className="text-label-1 text-label-neutral font-semibold"
          >
            이름
          </label>
          <TextField
            id="project-settings-name"
            value={name}
            maxLength={maxLength}
            onChange={(event) => setName(event.target.value)}
            width="100%"
            disabled={!canEditName}
            trailingContent={
              <TextFieldContent variant="text">
                <span className="text-caption-1 text-label-alternative font-medium">
                  {name.length}/{maxLength}
                </span>
              </TextFieldContent>
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-label-1 text-label-alternative font-medium">
            구성원 수: {info?.memberCount ?? 0}명
          </p>
          <p className="text-label-1 text-label-alternative font-medium">
            프로젝트 생성일: {info?.createdAt ?? '-'}
          </p>
        </div>
      </div>

      <div>
        {isOwner ? (
          <button
            type="button"
            onClick={handleDeleteProjectClick}
            disabled={!info}
            className="text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 inline-flex items-center gap-2 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconTrash className="text-status-negative h-4 w-4" aria-hidden="true" />
            프로젝트 삭제
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLeaveProjectClick}
            disabled={myRole === null}
            className="text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 inline-flex items-center gap-2 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconLogout className="text-status-negative h-4 w-4" aria-hidden="true" />
            프로젝트 나가기
          </button>
        )}
      </div>
    </div>
  );
};

ProjectSettingsPanel.displayName = 'ProjectSettingsPanel';
