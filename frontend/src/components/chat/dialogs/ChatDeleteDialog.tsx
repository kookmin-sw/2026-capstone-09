'use client';

interface ChatDeleteDialogProps {
  chatTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ChatDeleteDialog = ({
  chatTitle,
  onConfirm,
  onCancel,
}: ChatDeleteDialogProps) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-headline-1 text-label-normal font-semibold">채팅 삭제</h3>
        <p className="text-body-2 text-label-alternative">
          <span className="font-medium text-label-strong">&quot;{chatTitle}&quot;</span> 채팅을
          삭제하시겠어요?
        </p>
      </div>

      <div className="flex items-center justify-end gap-6">
        <button
          type="button"
          onClick={onConfirm}
          className="text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          채팅 삭제
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

ChatDeleteDialog.displayName = 'ChatDeleteDialog';