'use client';

import { cn } from '@/utils/cn';

interface AccountLogoutConfirmContentProps {
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 로그아웃 컨펌 다이얼로그 콘텐츠.
 * - 입력값이 없는 단순 컨펌이라 폼 훅은 분리하지 않는다.
 * - 백드롭/ESC/외부 클릭 닫힘은 공통 다이얼로그에 위임.
 */
export const AccountLogoutConfirmContent = ({
  onConfirm,
  onClose,
}: AccountLogoutConfirmContentProps) => {
  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <h3 className="text-headline-1 text-label-normal font-semibold">로그아웃 하시겠어요?</h3>
      <p className="text-body-2 text-label-alternative">
        다시 로그인하기 전까지 이 계정의 데이터에 접근할 수 없어요.
      </p>

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
          onClick={onConfirm}
          className={cn(
            'text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors',
            'focus-visible:ring-primary-40 focus-visible:ring-2 focus-visible:ring-offset-2',
          )}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

AccountLogoutConfirmContent.displayName = 'AccountLogoutConfirmContent';
