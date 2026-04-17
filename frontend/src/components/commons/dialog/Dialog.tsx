'use client';

import { useEffect, useCallback, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from '@/components/commons/dialog/DialogContext';

function DefaultDialog({ content }: { content: ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-white px-5 pt-5 pb-3">
      <div>{content}</div>
    </div>
  );
}

// Dialog Shell — 딤드 + 애니메이션 + variant 분기
export default function Dialog() {
  const { state, closeDialog } = useDialog()!;
  const { isOpen, content, closeOnBackdrop = false, closeOnEsc = false } = state;

  const backdropRef = useRef<HTMLDivElement>(null);

  // ESC 키 처리
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') closeDialog();
    },
    [closeOnEsc, closeDialog],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const DialogContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
      {/* 딤드 */}
      <div
        ref={backdropRef}
        className="animate-in fade-in bg-label-alternative absolute inset-0 backdrop-blur-[2px] duration-200"
        onClick={() => closeOnBackdrop && closeDialog()}
        aria-hidden="true"
      />

      {/* 다이얼로그 카드 */}
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-in fade-in zoom-in-95 relative z-20 min-w-90 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <DefaultDialog content={content!} />
      </div>
    </div>
  );

  // Portal로 body에 직접 렌더링
  return typeof document !== 'undefined' ? createPortal(DialogContent, document.body) : null;
}
