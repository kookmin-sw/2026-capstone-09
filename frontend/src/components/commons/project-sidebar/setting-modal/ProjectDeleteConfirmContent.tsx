'use client';

import { Button, TextField } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { buttonNegativeSolidSx, textFieldPrimaryFocusSx } from '@/styles/sx';

/**
 * 프로젝트 이름을 직접 입력해야 삭제가 활성화되는 확인 Dialog의 내용.
 * 일반 ConfirmDialogContent보다 복잡한 입력/검증 로직이 있어 별도 컴포넌트로 둔다.
 */
interface ProjectDeleteConfirmContentProps {
  projectName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ProjectDeleteConfirmContent = ({
  projectName,
  onConfirm,
  onClose,
}: ProjectDeleteConfirmContentProps) => {
  const [nameInput, setNameInput] = useState('');
  const trimmedInput = nameInput.trim();
  const canDelete = trimmedInput === projectName.trim() && projectName.trim().length > 0;
  const isInvalid = trimmedInput.length > 0 && !canDelete;

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
        invalid={isInvalid}
        sx={textFieldPrimaryFocusSx}
      />
      <Button
        variant="solid"
        color="primary"
        size="medium"
        fullWidth
        disabled={!canDelete}
        onClick={onConfirm}
        sx={canDelete ? buttonNegativeSolidSx : undefined}
      >
        프로젝트 삭제하기
      </Button>
    </div>
  );
};

ProjectDeleteConfirmContent.displayName = 'ProjectDeleteConfirmContent';
