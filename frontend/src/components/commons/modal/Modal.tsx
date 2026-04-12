"use client";

import { IconClose }  from '@wanteddev/wds-icon';
import { useEffect, useCallback, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useModal,ModalVariant } from "@/components/commons/modal/ModalContext";


const variantWidth: Record<ModalVariant, string> = {
  default: "w-[800px]",
  compact: "w-[800px]",
  sidebar: "w-[800px]",
};

const contentPadding: Record<ModalVariant, string> = {
  default: "p-12",       
  compact: "py-6 px-9", 
  sidebar: "py-6",        
};

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="모달 닫기"
      className="
        absolute top-5 right-5 z-10
        flex items-center justify-center w-8 h-8 
      "
    >
      <IconClose/>
    </button>
  );
}

// ────────────────────────────────────────────────────────────
// Variant: default — 상하좌우 패딩 48px
// ────────────────────────────────────────────────────────────
function DefaultModal({
  title,
  content,
  onClose,
}: {
  title?: ReactNode;
  content: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      <CloseButton onClose={onClose} />
      <div className={contentPadding.default}>
        {title && (
          <h2 className="text-[22px] font-semibold text-gray-900 mb-6 pr-8 leading-snug">
            {title}
          </h2>
        )}
        <div>{content}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Variant: compact — 좌우 36px / 상하 24px
// ────────────────────────────────────────────────────────────
function CompactModal({
  title,
  content,
  onClose,
}: {
  title?: ReactNode;
  content: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      <CloseButton onClose={onClose} />
      <div className={contentPadding.compact}>
        {title && (
          <h2 className="text-[20px] font-semibold text-gray-900 mb-4 pr-8 leading-snug">
            {title}
          </h2>
        )}
        <div>{content}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Variant: sidebar — 좌측 사이드바 + 상하 24px
// ────────────────────────────────────────────────────────────
function SidebarModal({
  title,
  sidebar,
  content,
  onClose,
}: {
  title?: ReactNode;
  sidebar?: ReactNode;
  content: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex min-h-[420px]">
      <CloseButton onClose={onClose} />

      {/* ── 사이드바 ── */}
      <aside
        className="
          w-[220px] shrink-0
          bg-gray-50 border-r border-gray-100
          py-6 px-5
        "
      >
        {sidebar ?? (
          <p className="text-xs text-gray-400 mt-2">사이드바 영역</p>
        )}
      </aside>

      {/* ── 본문 ── */}
      <div className="flex-1 py-6 px-8 pr-12 overflow-y-auto">
        {title && (
          <h2 className="text-[20px] font-semibold text-gray-900 mb-5 pr-6 leading-snug">
            {title}
          </h2>
        )}
        <div>{content}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Modal Shell — 백드롭 + 애니메이션 + variant 분기
// ────────────────────────────────────────────────────────────
export default function Modal() {
  const { state, closeModal } = useModal()!;
  const variant: ModalVariant = (state.variant ?? "default") as ModalVariant;   // 인덱싱 오류로 인한 구조분해 분리 및 타입 명시
  const {
    isOpen,
    title,
    sidebar,
    content,
    closeOnBackdrop = true,
    closeOnEsc = true,
  } = state;

  const backdropRef = useRef<HTMLDivElement>(null);

  // ESC 키 처리
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") closeModal();
    },
    [closeOnEsc, closeModal]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        px-4
      "
    >
      {/* 백드롭 */}
      <div
        ref={backdropRef}
        className="
          absolute inset-0
          bg-black/40 backdrop-blur-[2px]
          animate-in fade-in duration-200
        "
        onClick={() => closeOnBackdrop && closeModal()}
        aria-hidden="true"
      />

      {/* 모달 카드 */}
      <div
        role="dialog"
        aria-modal="true"
        className={`
          relative z-10 ${variantWidth[variant]}
          animate-in fade-in zoom-in-95 duration-200
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {variant === "default" && (
          <DefaultModal title={title} content={content!} onClose={closeModal} />
        )}
        {variant === "compact" && (
          <CompactModal title={title} content={content!} onClose={closeModal} />
        )}
        {variant === "sidebar" && (
          <SidebarModal
            title={title}
            sidebar={sidebar}
            content={content!}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );

  // Portal로 body에 직접 렌더링
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}