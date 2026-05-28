'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import { DownloadButton } from '../ui/DownloadButton';
import { GoogleLoginButton } from '../ui/GoogleLoginButton';
import { HeroNodeField } from '../visuals/HeroNodeField';
import { asset } from '@/lib/asset';

export function Hero() {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sx = useSpring(tiltX, { stiffness: 80, damping: 18 });
  const sy = useSpring(tiltY, { stiffness: 80, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      tiltX.set((e.clientX / w - 0.5) * 4);
      tiltY.set((e.clientY / h - 0.5) * -3);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [tiltX, tiltY]);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden pt-24 pb-40"
    >
      <HeroNodeField />

      <motion.div
        style={{ rotateX: sy, rotateY: sx, transformPerspective: 1000 }}
        className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col items-center px-4 text-center sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] sm:text-[12px]"
        >
          <span className="block h-px w-7 bg-[var(--color-primary-50)]/70" />
          <span className="font-medium uppercase tracking-[0.16em] text-[var(--color-primary-50)] sm:tracking-[0.22em]">
            KMU Capstone 2026
          </span>
          <span className="text-[var(--color-text-faint)]">/</span>
          <span className="font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)] sm:tracking-[0.22em]">
            Team 09
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[calc(100vw-32px)] text-balance font-bold leading-[1.02] tracking-[-0.04em]"
        >
          <span className="block whitespace-nowrap text-gradient-soft text-[24px] sm:text-[clamp(24px,6vw,88px)]">
            기획이 흐름을 만나는 순간,
          </span>
          <Image
            src={asset('/flowMeet.svg')}
            alt="flowMeet"
            width={840}
            height={160}
            priority
            style={{ width: 'min(82vw, 840px)' }}
            className="mx-auto mt-4 block h-auto"
          />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 hidden flex-col items-center justify-center gap-3 md:flex sm:flex-row sm:flex-wrap"
        >
          <GoogleLoginButton size="lg" />
          <DownloadButton size="lg" />
        </motion.div>
      </motion.div>

      {/* Centered bottom — keywords above, scroll below (static) */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-7">
        <div className="flex flex-row flex-nowrap items-center justify-center gap-x-6 px-4 text-[12px] sm:gap-x-10">
          <KeyMarker label="Node Flow" sub="기획 분기" />
          <span className="hidden h-7 w-px bg-white/[0.08] sm:block" />
          <KeyMarker label="Meeting" sub="자동 정리" />
          <span className="hidden h-7 w-px bg-white/[0.08] sm:block" />
          <KeyMarker label="AI Agent" sub="맥락 인식" />
        </div>
        <div className="flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
          <span>Scroll</span>
          {/* Fixed-height container so animating line doesn't shift the keywords above */}
          <div className="flex h-8 items-start justify-center">
            <motion.span
              animate={{ scaleY: [0.55, 1, 0.55] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top' }}
              className="block h-8 w-px bg-gradient-to-b from-[var(--color-primary-50)]/60 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyMarker({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 whitespace-nowrap">
      <span className="text-[12px] font-medium tracking-tight text-[var(--color-primary-50)] sm:text-[12.5px]">
        {label}
      </span>
      <span className="text-[9.5px] uppercase tracking-[0.16em] text-[var(--color-text-dim)] sm:text-[10px] sm:tracking-[0.2em]">
        {sub}
      </span>
    </div>
  );
}
