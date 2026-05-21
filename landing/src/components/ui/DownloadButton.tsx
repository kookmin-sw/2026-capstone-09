'use client';

import { motion } from 'framer-motion';

interface DownloadButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'subtle';
  href?: string;
}

export function DownloadButton({
  size = 'md',
  variant = 'subtle',
  href = 'https://github.com/kookmin-sw/2026-capstone-09/releases',
}: DownloadButtonProps) {
  const sizeClass =
    size === 'lg'
      ? 'h-12 px-6 text-[15px] gap-2.5'
      : size === 'sm'
        ? 'h-9 px-3.5 text-[12.5px] gap-1.5'
        : 'h-10 px-4 text-[13.5px] gap-2';

  const variantClass =
    variant === 'primary'
      ? 'bg-[var(--color-primary-50)] text-black font-semibold hover:shadow-[0_8px_28px_rgba(4,230,162,0.32)]'
      : 'border border-white/[0.12] bg-white/[0.04] text-white font-medium hover:bg-white/[0.08] hover:border-white/[0.22]';

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.97 }}
      className={[
        'inline-flex items-center justify-center rounded-full transition-all',
        sizeClass,
        variantClass,
      ].join(' ')}
      aria-label="자료 다운로드"
    >
      <DownloadIcon className={size === 'lg' ? 'h-4 w-4' : 'h-[14px] w-[14px]'} />
      <span>다운로드</span>
    </motion.a>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2v8m0 0 3-3m-3 3-3-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12v1.5A1.5 1.5 0 0 0 4.5 15h7A1.5 1.5 0 0 0 13 13.5V12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
