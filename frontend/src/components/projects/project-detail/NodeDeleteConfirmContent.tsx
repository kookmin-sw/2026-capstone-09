'use client';

import { Button, TextField } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { useState } from 'react';

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

// 입력값이 확인용 이름과 다를 때: negative 토큰으로 테두리·캐럿을 바꿔 즉시 에러 피드백.
const textFieldNegativeSx = {
  '[data-role="text-field-wrapper"]': {
    boxShadow: 'inset 0 0 0 1px var(--color-status-negative) !important',
  },
  '&:has(input:focus) [data-role="text-field-wrapper"]': {
    boxShadow:
      'inset 0 0 0 2px color-mix(in srgb, var(--color-status-negative) 43%, transparent) !important',
  },
  '[data-role="text-field-wrapper"] input': {
    caretColor: 'var(--color-status-negative)',
  },
} as const;

interface NodeDeleteConfirmContentProps {
  nodeName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const NodeDeleteConfirmContent = ({
  nodeName,
  onConfirm,
  onClose,
}: NodeDeleteConfirmContentProps) => {
  const [nameInput, setNameInput] = useState('');
  const trimmedInput = nameInput.trim();
  const canDelete = trimmedInput === nodeName.trim() && nodeName.trim().length > 0;
  const isInvalid = trimmedInput.length > 0 && !canDelete;

  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-heading-2 text-label-normal flex-1 font-semibold">
          노드를 삭제하시겠어요?
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
        노드를 삭제하시면 복구할 수 없으며, 모든 정보가 영구적으로 사라져요. 계속 진행하려면 노드
        이름을 입력해 주세요.
      </p>
      <TextField
        id="node-delete-confirm-name"
        value={nameInput}
        onChange={(event) => setNameInput(event.target.value)}
        placeholder={nodeName}
        width="100%"
        sx={isInvalid ? textFieldNegativeSx : textFieldPrimaryFocusSx}
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
        노드 삭제하기
      </Button>
    </div>
  );
};

NodeDeleteConfirmContent.displayName = 'NodeDeleteConfirmContent';
