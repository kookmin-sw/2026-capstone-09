'use client';

import { TextField } from '@wanteddev/wds';
import { useState } from 'react';

import { cn } from '@/utils/cn';

interface ProjectDeleteConfirmContentProps {
  /** 삭제 대상 프로젝트의 이름. placeholder · 검증값 양쪽으로 사용된다. */
  projectName: string;
  /** 입력값이 일치한 상태에서 삭제 버튼을 눌렀을 때 호출. */
  onConfirm: () => void;
  /** 닫기·취소 시 호출. */
  onClose: () => void;
}

/**
 * 프로젝트 삭제 컨펌 다이얼로그 콘텐츠.
 *
 * - 백드롭/ESC/외부 클릭 닫힘은 공통 다이얼로그(`useDialog` + `commons/custom-dialog`)에 위임.
 * - 사용자가 프로젝트 이름을 정확히 똑같이 입력해야 삭제 버튼이 활성화된다.
 * - 실제 `privateApi.project.deleteProject` 호출은 부모(`ProjectSettingsPanel`)에서 onConfirm으로 처리.
 * - WDS Button color에 negative 톤이 없어 native button + 디자인 토큰 클래스로 처리한다.
 */
export const ProjectDeleteConfirmContent = ({
  projectName,
  onConfirm,
  onClose,
}: ProjectDeleteConfirmContentProps) => {
  const [nameInput, setNameInput] = useState('');
  const trimmedInput = nameInput.trim();
  const trimmedTarget = projectName.trim();
  const canDelete = trimmedTarget.length > 0 && trimmedInput === trimmedTarget;
  const isInvalid = trimmedInput.length > 0 && !canDelete;

  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <h3 className="text-headline-1 text-label-normal font-semibold">프로젝트를 삭제하시겠어요?</h3>
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
      />
      <div className="flex items-center justify-end gap-6 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="text-body-1 text-label-alternative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          취소
        </button>
        <button
          type="button"
          disabled={!canDelete}
          onClick={onConfirm}
          className={cn(
            'text-body-1 rounded-md px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
            'focus-visible:ring-primary-40',
            canDelete
              ? 'text-status-negative hover:bg-fill-normal active:bg-fill-strong bg-transparent'
              : 'text-label-disable cursor-not-allowed bg-transparent',
          )}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

ProjectDeleteConfirmContent.displayName = 'ProjectDeleteConfirmContent';
