'use client';

import { useEffect, useCallback, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useModal, ModalVariant } from '@/components/commons/modal/ModalContext';

const variantWidth: Record<ModalVariant, string> = {
  default: 'w-200',
  compact: 'w-230',
  sidebar: 'w-200',
};

const contentPadding: Record<ModalVariant, string> = {
  default: 'p-12',
  compact: 'py-6 px-9',
  sidebar: 'py-6',
};

// Variant: default — 상하좌우 패딩 48px
function DefaultModal({ content }: { content: ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-4xl bg-white">
      <div className={contentPadding.default}>
        <div>{content}</div>
      </div>
    </div>
  );
}

// Variant: compact — 좌우 36px / 상하 24px
function CompactModal({ content }: { content: ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-4xl bg-white">
      <div className={contentPadding.compact}>
        <div>{content}</div>
      </div>
    </div>
  );
}

// Variant: sidebar — 좌측 사이드바 + 상하 24px
function SidebarModal({ sidebar, content }: { sidebar?: ReactNode; content: ReactNode }) {
  return (
    <div className="relative flex min-h-125 w-full gap-8 overflow-hidden rounded-4xl bg-white">
      {/* ── 사이드바 ── */}
      <aside className="bg-background-normal-alternative w-50 shrink-0 p-6">
        {sidebar ?? <p className="text-label-1 text-label-strong mt-2">사이드바 영역</p>}
      </aside>

      {/* ── 본문 ── */}
      <div className="flex-1 py-6">
        <div>{content}</div>
      </div>
    </div>
  );
}

// Modal Shell — 딤드 + 애니메이션 + variant 분기
export default function Modal() {
  const { state, closeModal } = useModal()!;
  const variant: ModalVariant = (state.variant ?? 'default') as ModalVariant; // 인덱싱 오류로 인한 구조분해 분리 및 타입 명시
  const { isOpen, sidebar, content, closeOnBackdrop = false, closeOnEsc = false } = state;

  const backdropRef = useRef<HTMLDivElement>(null);

  // ESC 키 처리
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') closeModal();
    },
    [closeOnEsc, closeModal],
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

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
      {/* 딤드 */}
      <div
        ref={backdropRef}
        className="animate-in fade-in bg-label-alternative absolute inset-0 backdrop-blur-[2px] duration-200"
        onClick={() => closeOnBackdrop && closeModal()}
        aria-hidden="true"
      />

      {/* 모달 카드 */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 ${variantWidth[variant]} animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {variant === 'default' && <DefaultModal content={content!} />}
        {variant === 'compact' && <CompactModal content={content!} />}
        {variant === 'sidebar' && <SidebarModal sidebar={sidebar} content={content!} />}
      </div>
    </div>
  );

  // Portal로 body에 직접 렌더링
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
