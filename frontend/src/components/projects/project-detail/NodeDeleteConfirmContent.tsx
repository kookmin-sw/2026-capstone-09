'use client';

import { Button, TextField, Typography } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { buttonNegativeSolidSx, textFieldPrimaryFocusSx } from '@/styles/sx';

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
        <Typography
          as="h3"
          variant="heading2"
          weight="bold"
          color="semantic.label.normal"
          sx={{ flex: 1 }}
        >
          노드를 삭제하시겠어요?
        </Typography>
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
        노드 삭제하기
      </Button>
    </div>
  );
};

NodeDeleteConfirmContent.displayName = 'NodeDeleteConfirmContent';
