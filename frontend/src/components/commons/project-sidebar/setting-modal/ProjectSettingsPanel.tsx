'use client';

import { Avatar, TextField, TextFieldContent } from '@wanteddev/wds';
import { IconLogout, IconTrash } from '@wanteddev/wds-icon';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { useErrorToast } from '@/hooks/useErrorToast';
import {
  useDeleteProjectMutation,
  useLeaveProjectMutation,
  useProjectQuery,
  useUpdateProjectImageMutation,
  useUpdateProjectMutation,
} from '@/queries/project';

import { ProjectDeleteConfirmContent } from './ProjectDeleteConfirmContent';
import { ProjectLeaveConfirmContent } from './ProjectLeaveConfirmContent';
import type { ProjectMemberRole } from './SettingsModalContent';
import { useProjectInfoForm } from './useProjectInfoForm';

interface ProjectSettingsPanelProps {
  projectId: number;
  myRole: ProjectMemberRole | null;
  onSettingsClose: () => void;
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

const normalizeImageUrl = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  if (/^(https?:)?\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

const AUTO_SAVE_DEBOUNCE_MS = 1000;

const PROJECT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const PROJECT_IMAGE_ACCEPT = ['image/png', 'image/jpeg', 'image/webp'] as const;

export const ProjectSettingsPanel = ({
  projectId,
  myRole,
  onSettingsClose,
}: ProjectSettingsPanelProps) => {
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const toast = usePositionedToast();
  const showErrorToast = useErrorToast();

  const { data: projectData } = useProjectQuery(projectId);
  const updateProjectMutation = useUpdateProjectMutation(projectId);
  const updateProjectImageMutation = useUpdateProjectImageMutation(projectId);
  const deleteProjectMutation = useDeleteProjectMutation(projectId);
  const leaveProjectMutation = useLeaveProjectMutation(projectId);

  // 동일 URL로 이미지를 덮어써도 브라우저가 캐시된 이전 이미지를 그대로 띄우는 문제 우회용.
  const [imageBustKey, setImageBustKey] = useState(0);

  const isOwner = myRole === 'OWNER';
  const canEditName = isOwner;
  const canUploadImage = isOwner;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!canUploadImage) return;
    fileInputRef.current?.click();
  };

  const profileImageUrl = normalizeImageUrl(projectData?.profileImageUrl);
  const createdAt = formatCreatedAt(projectData?.createdAt);

  const { name, setName, canSave, maxLength } = useProjectInfoForm({
    initialName: projectData?.name ?? '',
  });

  // 이름 자동 저장: OWNER 권한 + 마지막 입력 후 1초가 지나면 updateProject 호출.
  // useEffect 대신 debounce ref 패턴으로 관리해 deps 경고 없이 최신 값 참조.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleNameChange = (next: string) => {
    setName(next);
    if (!canEditName) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = next.trim();
      const isDifferent = trimmed.length > 0 && trimmed !== (projectData?.name ?? '').trim();
      if (!isDifferent) return;
      updateProjectMutation.mutateAsync(trimmed).then(() => {
        toast({
          content: '프로젝트 이름을 수정했어요',
          variant: 'normal',
          placement: 'bottom-left',
          duration: 'short',
        });
      }).catch((caught) => {
        showErrorToast(caught, '프로젝트 이름 수정에 실패했어요.');
      });
    }, AUTO_SAVE_DEBOUNCE_MS);
  };

  const handleProjectImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !canUploadImage) return;

    const isAllowedType = PROJECT_IMAGE_ACCEPT.includes(
      file.type as (typeof PROJECT_IMAGE_ACCEPT)[number],
    );
    if (!isAllowedType) {
      toast({ content: 'PNG·JPEG·WEBP 파일만 업로드할 수 있어요', variant: 'negative', placement: 'bottom-left', duration: 'short' });
      return;
    }
    if (file.size > PROJECT_IMAGE_MAX_BYTES) {
      toast({ content: '파일 크기는 5MB 이하여야 해요', variant: 'negative', placement: 'bottom-left', duration: 'short' });
      return;
    }

    try {
      await updateProjectImageMutation.mutateAsync(file);
      setImageBustKey(Date.now());
      toast({ content: '프로젝트 이미지를 변경했어요', variant: 'normal', placement: 'bottom-left', duration: 'short' });
    } catch (caught) {
      showErrorToast(caught, '프로젝트 이미지 업로드에 실패했어요');
    }
  };

  const handleDeleteProjectClick = () => {
    if (!projectData) return;
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ProjectDeleteConfirmContent
          projectName={projectData.name ?? ''}
          onConfirm={async () => {
            try {
              await deleteProjectMutation.mutateAsync();
              closeDialog();
              onSettingsClose();
              router.push('/projects');
              toast({ content: '프로젝트를 삭제했어요', variant: 'normal', placement: 'bottom-left', duration: 'short' });
            } catch (caught) {
              showErrorToast(caught, '프로젝트 삭제에 실패했어요.');
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
              await leaveProjectMutation.mutateAsync();
              closeDialog();
              onSettingsClose();
              router.push('/projects');
              toast({ content: '프로젝트에서 나갔어요', variant: 'normal', placement: 'bottom-left', duration: 'short' });
            } catch (caught) {
              showErrorToast(caught, '프로젝트 나가기에 실패했어요.');
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
        <div className="flex items-center gap-8">
          <div className="relative inline-flex shrink-0 overflow-hidden rounded-3xl">
            <Avatar
              variant="company"
              size={84}
              src={
                profileImageUrl
                  ? imageBustKey > 0
                    ? `${profileImageUrl}?v=${imageBustKey}`
                    : profileImageUrl
                  : undefined
              }
              alt={projectData?.name ?? '프로젝트'}
            />
            {canUploadImage && (
              <>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  aria-label="프로젝트 이미지 변경"
                  className="hover:bg-label-normal/20 focus-visible:ring-primary-40 absolute inset-0 z-10 cursor-pointer rounded-3xl border-none bg-transparent outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={PROJECT_IMAGE_ACCEPT.join(',')}
                  className="sr-only"
                  onChange={handleProjectImageChange}
                />
              </>
            )}
          </div>

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
              onChange={(event) => handleNameChange(event.target.value)}
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
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-label-1 text-label-alternative font-medium">
            구성원 수: {projectData?.memberCount ?? 0}명
          </p>
          <p className="text-label-1 text-label-alternative font-medium">
            프로젝트 생성일: {createdAt}
          </p>
        </div>
      </div>

      <div>
        {isOwner ? (
          <button
            type="button"
            onClick={handleDeleteProjectClick}
            disabled={!projectData}
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
