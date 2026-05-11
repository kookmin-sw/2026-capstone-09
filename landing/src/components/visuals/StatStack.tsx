'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

interface StatStackProps {
  title: string;
  subtitle?: string;
  segments: { label: string; value: number; highlight?: boolean }[];
  total?: string;
}

const COLORS = ['#04e6a2', '#7BD3FF', '#C7B8FF', '#FFB78A'];

export function StatStack({ title, subtitle, segments, total }: StatStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const sum = segments.reduce((a, s) => a + s.value, 0);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div>
        <h5 className="text-[14px] font-semibold text-white">{title}</h5>
        {subtitle && <p className="mt-1 text-[12px] text-[var(--color-text-dim)]">{subtitle}</p>}
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
        {segments.reduce<{ acc: number; els: React.ReactNode[] }>(
          (st, seg, i) => {
            const left = (st.acc / sum) * 100;
            const w = (seg.value / sum) * 100;
            const color = seg.highlight ? COLORS[0] : COLORS[i % COLORS.length];
            const active = hover === i || hover === null;
            st.els.push(
              <motion.span
                key={i}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{
                  left: `${left}%`,
                  width: `${w}%`,
                  background: color,
                  transformOrigin: 'left',
                  opacity: active ? (seg.highlight ? 1 : 0.65) : 0.35,
                  cursor: 'pointer',
                  boxShadow: seg.highlight ? '0 0 14px rgba(4,230,162,0.45)' : undefined,
                }}
                className="absolute inset-y-0 transition-opacity duration-200"
              />,
            );
            st.acc += seg.value;
            return st;
          },
          { acc: 0, els: [] },
        ).els}
      </div>

      <ul className="grid grid-cols-1 gap-1.5 text-[12.5px] sm:grid-cols-2">
        {segments.map((s, i) => {
          const color = s.highlight ? COLORS[0] : COLORS[i % COLORS.length];
          const active = hover === i;
          return (
            <li
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={[
                'flex items-center gap-2 rounded-md px-2 py-1 transition-colors',
                active ? 'bg-white/[0.04]' : '',
              ].join(' ')}
            >
              <span className="h-2 w-2 flex-none rounded-full" style={{ background: color }} />
              <span
                className={[
                  'transition-colors',
                  active ? 'text-white' : 'text-[var(--color-text-muted)]',
                ].join(' ')}
              >
                {s.label}
              </span>
              <span className="ml-auto tabular-nums text-white">{s.value.toFixed(1)}%</span>
            </li>
          );
        })}
      </ul>

      {total && <p className="text-[11.5px] text-[var(--color-text-faint)]">{total}</p>}
    </div>
  );
}
