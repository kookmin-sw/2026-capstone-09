'use client';

import { TextButton, TextField, Typography } from '@wanteddev/wds';
import { useState } from 'react';

import { textButtonNegativeSx, textFieldPrimaryFocusSx } from '@/styles/sx';

export interface LinkEditPayload {
  id: string;
  label: string;
  href: string;
}

type LinkEditDialogMode = 'add' | 'edit';

interface LinkEditDialogContentProps {
  mode?: LinkEditDialogMode;
  initialLink: LinkEditPayload;
  onSave: (link: LinkEditPayload) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const LinkEditDialogContent = ({
  mode = 'edit',
  initialLink,
  onSave,
  onDelete,
  onClose,
}: LinkEditDialogContentProps) => {
  const isAddMode = mode === 'add';
  const [label, setLabel] = useState(initialLink.label);
  const [href, setHref] = useState(initialLink.href);

  const hasRequired = label.trim().length > 0 && href.trim().length > 0;
  const canSave = isAddMode
    ? hasRequired
    : hasRequired && (label !== initialLink.label || href !== initialLink.href);

  const handleSave = () => {
    if (!canSave) return;
    onSave({ id: initialLink.id, label: label.trim(), href: href.trim() });
  };

  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <Typography as="h3" variant="heading2" weight="bold" color="semantic.label.normal">
        {isAddMode ? '링크 추가' : '링크 수정'}
      </Typography>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="link-edit-label"
          className="text-caption-1 text-label-neutral font-semibold"
        >
          이름
        </label>
        <TextField
          id="link-edit-label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="이름을 입력해 주세요."
          width="100%"
          sx={textFieldPrimaryFocusSx}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="link-edit-href" className="text-caption-1 text-label-neutral font-semibold">
          URL
        </label>
        <TextField
          id="link-edit-href"
          type="url"
          value={href}
          onChange={(event) => setHref(event.target.value)}
          placeholder="링크를 입력해 주세요."
          width="100%"
          sx={textFieldPrimaryFocusSx}
        />
      </div>

      <div
        className={`flex items-center gap-6 pt-2 ${isAddMode ? 'justify-end' : 'justify-between'}`}
      >
        {!isAddMode && onDelete && (
          <TextButton
            size="medium"
            color="assistive"
            onClick={() => onDelete(initialLink.id)}
            sx={textButtonNegativeSx}
          >
            삭제
          </TextButton>
        )}

        <div className="flex items-center gap-6">
          <TextButton size="medium" color="assistive" onClick={onClose}>
            취소
          </TextButton>
          <TextButton size="medium" color="primary" disabled={!canSave} onClick={handleSave}>
            저장
          </TextButton>
        </div>
      </div>
    </div>
  );
};

LinkEditDialogContent.displayName = 'LinkEditDialogContent';
