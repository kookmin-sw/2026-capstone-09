'use client';

import { TextField } from '@wanteddev/wds';
import { useState } from 'react';

import { cn } from '@/utils/cn';

interface AccountWithdrawConfirmContentProps {
  /** 표시·검증에 사용할 닉네임. 사용자가 정확히 같은 값을 입력해야 탈퇴 활성화. */
  nickname: string;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 회원 탈퇴 컨펌 다이얼로그 콘텐츠.
 * - 닉네임 정확 입력 필요 (이름 일치 검증 패턴, NodeDelete/ProjectDelete 와 동일).
 * - 백드롭/ESC/외부 클릭 닫힘은 공통 다이얼로그에 위임.
 */
export const AccountWithdrawConfirmContent = ({
  nickname,
  onConfirm,
  onClose,
}: AccountWithdrawConfirmContentProps) => {
  const [input, setInput] = useState('');
  const trimmedInput = input.trim();
  const trimmedTarget = nickname.trim();
  const canWithdraw = trimmedTarget.length > 0 && trimmedInput === trimmedTarget;
  const isInvalid = trimmedInput.length > 0 && !canWithdraw;

  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <h3 className="text-headline-1 text-label-normal font-semibold">계정을 탈퇴하시겠어요?</h3>
      <p className="text-body-2 text-label-alternative whitespace-pre-line">
        한 번 탈퇴하면 계정 정보를 복구할 수 없어요. 계속 진행하려면 닉네임을 입력해 주세요.
      </p>
      <TextField
        id="account-withdraw-confirm-nickname"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={nickname}
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
          disabled={!canWithdraw}
          onClick={onConfirm}
          className={cn(
            'text-body-1 rounded-md px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
            'focus-visible:ring-primary-40',
            canWithdraw
              ? 'text-status-negative hover:bg-fill-normal active:bg-fill-strong bg-transparent'
              : 'text-label-disable cursor-not-allowed bg-transparent',
          )}
        >
          탈퇴
        </button>
      </div>
    </div>
  );
};

AccountWithdrawConfirmContent.displayName = 'AccountWithdrawConfirmContent';
