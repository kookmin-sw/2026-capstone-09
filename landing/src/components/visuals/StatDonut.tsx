'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';

interface StatDonutProps {
  value: number;
  label: string;
  size?: number;
}

export function StatDonut({ value, label, size = 200 }: StatDonutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);
  const reactId = useId();
  const safeId = reactId.replace(/:/g, '_');

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const stroke = 18;
  const r = size / 2 - stroke / 2 - 2;
  const c = 2 * Math.PI * r;
  const offset = c - (display / 100) * c;
  const pad = 24;
  const vbSize = size + pad * 2;

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -3 }}
      className="group flex flex-col items-center gap-4 px-3 transition-transform"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={vbSize}
          height={vbSize}
          viewBox={`${-pad} ${-pad} ${vbSize} ${vbSize}`}
          className="absolute -left-6 -top-6 -rotate-90"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`donut-grad-${safeId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#04e6a2" />
              <stop offset="100%" stopColor="#02a07a" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#donut-grad-${safeId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ filter: 'drop-shadow(0 0 16px rgba(4,230,162,0.45))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[44px] font-semibold tabular-nums text-white">
            {display.toFixed(1)}%
          </span>
        </div>
      </div>
      <p className="max-w-[260px] text-balance text-center text-[15.5px] leading-[1.55] text-[var(--color-text-muted)] transition-colors group-hover:text-white">
        {label}
      </p>
    </motion.div>
  );
}
