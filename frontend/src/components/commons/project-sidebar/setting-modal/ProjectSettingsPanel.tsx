'use client';

import { Avatar, TextButton, TextField, TextFieldContent } from '@wanteddev/wds';
import { IconTrash } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { EXAMPLE_PROJECT_SETTINGS } from '@/constants/exampleConstant';
import { useProfileImagePreview } from '@/hooks/useProfileImagePreview';
import { textButtonNegativeSx, textFieldPrimaryFocusSx } from '@/styles/sx';

import { ProjectDeleteConfirmContent } from './ProjectDeleteConfirmContent';

export const ProjectSettingsPanel = () => {
  const { openDialog, closeDialog } = useDialog();
  const [projectName, setProjectName] = useState<string>(EXAMPLE_PROJECT_SETTINGS.projectName);
  const { previewUrl: projectPreviewUrl, handleImageChange: handleProjectImageChange } =
    useProfileImagePreview();

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
          leadingContent={<IconTrash className="text-status-negative h-4 w-4" aria-hidden="true" />}
          sx={textButtonNegativeSx}
        >
          프로젝트 삭제
        </TextButton>
      </div>
    </div>
  );
};

ProjectSettingsPanel.displayName = 'ProjectSettingsPanel';
