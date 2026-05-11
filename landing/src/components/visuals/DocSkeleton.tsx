'use client';

import { motion } from 'framer-motion';

/**
 * Empty visual placeholder for Doc diagrams.
 * White background reserved area to be replaced with a real image asset later.
 */
export function DocSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/[0.10] bg-white"
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.04) 75%, transparent 75%)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-500">
        <ImageIcon />
        <span className="text-[12px] uppercase tracking-[0.22em]">이미지 자리</span>
      </div>
    </motion.div>
  );
}

function ImageIcon() {
  return (
    <svg
      className="h-9 w-9 opacity-70"
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth="1.4"
      stroke="currentColor"
      aria-hidden
    >
      <rect x="4" y="6" width="24" height="20" rx="2" />
      <circle cx="11" cy="13" r="2.5" />
      <path d="m4 22 7-7 7 7 4-4 6 6" strokeLinejoin="round" />
    </svg>
  );
}
