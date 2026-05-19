'use client';

import { cn } from '@/utils/cn';

interface ProjectLeaveConfirmContentProps {
  /** "나가기" 버튼을 눌렀을 때 호출. 실제 leaveProject 호출은 부모에서 처리. */
  onConfirm: () => void;
  /** "취소" 버튼·외부에서 닫을 때 호출. */
  onClose: () => void;
}

/**
 * 프로젝트 나가기 컨펌 다이얼로그 콘텐츠.
 *
 * - 백드롭/ESC/외부 클릭 닫힘은 공통 다이얼로그(`useDialog` + `commons/custom-dialog`)에 위임.
 * - 입력값이 없는 단순 컨펌이라 폼 훅은 분리하지 않는다.
 * - WDS Button color 가 negative 톤을 지원하지 않아 native button + 디자인 토큰 클래스로 처리.
 */
export const ProjectLeaveConfirmContent = ({
  onConfirm,
  onClose,
}: ProjectLeaveConfirmContentProps) => {
  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <h3 className="text-headline-1 text-label-normal font-semibold">
        프로젝트에서 나가시겠어요?
      </h3>
      <p className="text-body-2 text-label-alternative">
        나가면 다시 초대받기 전까지 이 프로젝트에 접근할 수 없어요.
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
          나가기
        </button>
      </div>
    </div>
  );
};

ProjectLeaveConfirmContent.displayName = 'ProjectLeaveConfirmContent';
