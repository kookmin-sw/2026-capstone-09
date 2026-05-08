'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const SEGMENTS = [
  { label: '매우 있음', value: 58.9, color: '#04e6a2', bright: true },
  { label: '조금 있음', value: 32.6, color: '#0aa97a' },
  { label: '보통', value: 6.2, color: '#3a3f4a' },
  { label: '별로 없음', value: 2.3, color: '#2a2d36' },
];

export function IntentDistribution() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-7 transition-colors hover:bg-white/[0.06]"
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary-50)]">
        Intent
      </p>
      <h4 className="mt-2 text-[17px] font-semibold leading-[1.4] text-white">
        시각화 도구를 도입할 의향
      </h4>

      <div className="mt-7 flex h-12 w-full overflow-hidden rounded-xl border border-white/[0.06]">
        {SEGMENTS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ flexGrow: 0 }}
            animate={inView ? { flexGrow: s.value } : { flexGrow: 0 }}
            transition={{ duration: 1.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: s.color, flexBasis: 0 }}
            className="relative flex items-center justify-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
              className={[
                'font-medium text-[12.5px] font-semibold tabular-nums whitespace-nowrap',
                s.bright ? 'text-black' : 'text-white',
              ].join(' ')}
            >
              {s.value.toFixed(1)}%
            </motion.span>
            {s.bright && <span className="absolute inset-0 animate-shimmer" />}
          </motion.div>
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2">
        {SEGMENTS.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.06 }}
            className="flex items-center gap-2 text-[12.5px]"
          >
            <span className="block h-2 w-2 flex-none rounded-full" style={{ background: s.color }} />
            <span className="text-[var(--color-text-muted)]">{s.label}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-[var(--color-primary-50)]/25 bg-black/30 px-4 py-3">
        <p className="text-[12px] text-[var(--color-text-muted)]">
          긍정 응답 합계 ·{' '}
          <span className="font-medium font-semibold text-[var(--color-primary-50)]">91.5%</span>
        </p>
      </div>
    </div>
  );
}
