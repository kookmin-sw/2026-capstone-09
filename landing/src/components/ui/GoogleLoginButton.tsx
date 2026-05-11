'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface GoogleLoginButtonProps {
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export function GoogleLoginButton({ size = 'md', compact = false }: GoogleLoginButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const cy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(cx * 5);
    y.set(cy * 4);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const sizeClass =
    size === 'lg'
      ? 'h-12 px-6 text-[15px] gap-3'
      : size === 'sm'
        ? 'h-9 px-3 text-[13px] gap-2'
        : 'h-10 px-4 text-[14px] gap-2';

  return (
    <motion.a
      ref={ref}
      href="#"
      onClick={(e) => e.preventDefault()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={[
        'group relative inline-flex items-center justify-center rounded-full font-medium',
        'border border-white/15 bg-white text-neutral-900',
        'transition-shadow duration-300',
        'hover:shadow-[0_8px_32px_rgba(4,230,162,0.32)]',
        sizeClass,
      ].join(' ')}
      aria-label="Google로 시작하기"
    >
      <GoogleGIcon className={size === 'lg' ? 'h-5 w-5' : 'h-[18px] w-[18px]'} />
      <span className={compact ? 'hidden' : undefined}>Google로 시작하기</span>
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(120%_120%_at_50%_0%,rgba(4,230,162,0.22),transparent_55%)]" />
    </motion.a>
  );
}

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.12A6.97 6.97 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.96l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
