'use client';

interface MeetingDeleteConfirmContentProps {
  onConfirm: () => void;
  onCancel: () => void;
  /** 회의가 현재 진행 중(IN_PROGRESS)일 때 true. 경고 문구를 함께 표시한다. */
  isInProgress?: boolean;
}

export const MeetingDeleteConfirmContent = ({
  onConfirm,
  onCancel,
  isInProgress = false,
}: MeetingDeleteConfirmContentProps) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-headline-1 text-label-normal font-semibold">회의 삭제</h3>
        {isInProgress ? (
          <p className="text-body-2 text-status-cautionary">
            현재 진행 중인 회의예요. 그래도 삭제하시겠어요?
          </p>
        ) : (
          <p className="text-body-2 text-label-alternative">회의를 삭제하시겠어요?</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-6">
        <button
          type="button"
          onClick={onConfirm}
          className="text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          회의 삭제
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

MeetingDeleteConfirmContent.displayName = 'MeetingDeleteConfirmContent';
