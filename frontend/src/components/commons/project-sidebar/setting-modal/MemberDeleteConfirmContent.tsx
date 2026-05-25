'use client';

import { cn } from '@/utils/cn';

interface MemberDeleteConfirmContentProps {
  /** 삭제 대상 멤버의 닉네임 또는 이메일. 다이얼로그 본문에 표시된다. */
  memberName: string;
  /** 삭제 확인 버튼을 눌렀을 때 호출. */
  onConfirm: () => void;
  /** 닫기·취소 시 호출. */
  onClose: () => void;
}

/**
 * 구성원 삭제 컨펌 다이얼로그 콘텐츠.
 *
 * - 실제 `deleteMe` 호출은 부모(`MembersSettingsPanel`)에서 onConfirm으로 처리.
 */
export const MemberDeleteConfirmContent = ({
  memberName,
  onConfirm,
  onClose,
}: MemberDeleteConfirmContentProps) => (
  <div className="flex w-90 flex-col gap-4 pb-2">
    <h3 className="text-headline-1 text-label-normal font-semibold">구성원을 삭제하시겠어요?</h3>
    <p className="text-body-2 text-label-alternative whitespace-pre-line">
      <span className="text-label-normal font-medium">{memberName}</span>
      {' '}님을 프로젝트에서 내보내면 다시 초대하기 전까지 접근할 수 없어요.
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
          'text-body-1 rounded-md px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-primary-40',
          'text-status-negative hover:bg-fill-normal active:bg-fill-strong bg-transparent',
        )}
      >
        삭제
      </button>
    </div>
  </div>
);

MemberDeleteConfirmContent.displayName = 'MemberDeleteConfirmContent';
