'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AnimatedBarProps {
  label: string;
  value: number;
  highlight?: boolean;
  delay?: number;
}

export function AnimatedBar({ label, value, highlight, delay = 0 }: AnimatedBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start) / dur));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, delay]);

  return (
    <div ref={ref} className="group relative flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <p className={[
          'text-[14px] transition-colors',
          highlight ? 'text-white' : 'text-[var(--color-text-muted)] group-hover:text-white',
        ].join(' ')}>
          {label}
        </p>
        <span
          className={[
            'font-medium text-[22px] font-semibold tracking-tight tabular-nums transition-colors',
            highlight ? 'text-[var(--color-primary-50)]' : 'text-white',
          ].join(' ')}
        >
          {display.toFixed(1)}%
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            highlight
              ? 'bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-primary-30)] shadow-[0_0_18px_rgba(4,230,162,0.4)]'
              : 'bg-white/30'
          }`}
        >
          {highlight && <span className="absolute inset-0 animate-shimmer rounded-full" />}
        </motion.div>
      </div>
    </div>
  );
}
