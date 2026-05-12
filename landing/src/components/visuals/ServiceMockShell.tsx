'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ServiceMockShellProps {
  url?: string;
  children: ReactNode;
  height?: number;
  className?: string;
}

export function ServiceMockShell({
  url = 'flowmeet.kr',
  children,
  height = 560,
  className = '',
}: ServiceMockShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className={`relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#101319] shadow-[0_30px_80px_rgba(0,0,0,0.5)] ${className}`}
    >
      <span className="pointer-events-none absolute -inset-px rounded-[20px] bg-gradient-to-br from-[var(--color-primary-50)]/20 via-transparent to-transparent opacity-40" />
      <div className="relative flex items-center justify-between border-b border-white/[0.06] bg-[#0c0e12] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/60" />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1 text-[11.5px] text-[var(--color-text-dim)]">
          <LockIcon />
          <span className="font-medium tracking-[0.05em]">{url}</span>
        </div>
        <span className="w-12" />
      </div>
      <div
        className="relative overflow-hidden bg-[#FAFAFB]"
        style={{ height }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function LockIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
