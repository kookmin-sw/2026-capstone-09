'use client';

import { TextField } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { cn } from '@/utils/cn';

interface ChatRenameDialogProps {
  currentTitle: string;
  onConfirm: (newTitle: string) => void;
  onCancel: () => void;
}

export const ChatRenameDialog = ({
  currentTitle,
  onConfirm,
  onCancel,
}: ChatRenameDialogProps) => {
  const [title, setTitle] = useState(currentTitle);

  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle && trimmedTitle !== currentTitle;

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm(trimmedTitle);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-heading-2 text-label-normal flex-1 font-medium">
          채팅 이름 변경
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="닫기"
          className="text-label-alternative hover:text-label-neutral flex h-6 w-6 shrink-0 items-center justify-center border-none bg-transparent p-0"
        >
          <IconClose className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <p className="text-body-2 text-label-alternative">
        새로운 채팅 제목을 입력해 주세요.
      </p>

      <TextField
        id="chat-rename-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="채팅 제목 입력"
        width="100%"
        autoFocus
      />

      <div className="flex items-center justify-end gap-6">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleConfirm}
          className={cn(
            'text-body-1 hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
            canSubmit ? 'text-primary-40' : 'text-label-disable cursor-not-allowed',
          )}
        >
          이름 변경
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-body-1 text-label-alternative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          취소
        </button>
      </div>
    </div>
  );
};

ChatRenameDialog.displayName = 'ChatRenameDialog';