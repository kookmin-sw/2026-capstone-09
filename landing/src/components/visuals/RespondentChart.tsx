'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const SEGMENTS = [
  { label: '대학생', value: 54.3, color: '#04e6a2' },
  { label: '개발자', value: 19.4, color: '#7BD3FF' },
  { label: '기획자 (PM/PO)', value: 7.8, color: '#C7B8FF' },
  { label: '디자이너', value: 1.6, color: '#FFB78A' },
  { label: '기타 (졸업생, 운영, 직장인 등)', value: 16.9, color: '#3a3f4a' },
];

export function RespondentChart() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const size = 320;
  const stroke = 32;
  const r = size / 2 - stroke / 2 - 2;
  const c = 2 * Math.PI * r;

  let acc = 0;
  const arcs = SEGMENTS.map((s) => {
    const len = (s.value / 100) * c;
    const offset = c - len;
    const rotate = (acc / 100) * 360 - 90;
    acc += s.value;
    return { ...s, len, offset, rotate };
  });

  function handleMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
      {/* Donut on left */}
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{ width: size, height: size }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg
          width={size}
          height={size}
          className="absolute inset-0"
          style={{ overflow: 'visible' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {arcs.map((a, i) => (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={hover === i ? stroke + 4 : stroke}
              strokeDasharray={c}
              strokeDashoffset={inView ? a.offset : c}
              onMouseEnter={() => setHover(i)}
              style={{
                transform: `rotate(${a.rotate}deg)`,
                transformOrigin: '50% 50%',
                transition: `stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.18}s, stroke-width 0.2s ease`,
                filter: i === 0 ? 'drop-shadow(0 0 22px rgba(4,230,162,0.55))' : undefined,
                opacity: hover === null || hover === i ? 1 : 0.4,
                pointerEvents: 'stroke',
                cursor: 'pointer',
              }}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[12px] tracking-[0.2em] text-[var(--color-text-dim)]">
            RESPONDENTS
          </span>
          <span className="mt-1.5 text-[15px] text-[var(--color-text-muted)]">기획·실무 경험자</span>
        </div>

        {hover !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-lg border border-white/[0.12] bg-[#0c0e12] px-3 py-2 shadow-lg"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="flex items-center gap-2">
              <span
                className="block h-2 w-2 flex-none rounded-sm"
                style={{ background: SEGMENTS[hover].color }}
              />
              <span className="text-[12px] text-[var(--color-text-muted)]">
                {SEGMENTS[hover].label}
              </span>
              <span className="text-[13px] font-semibold tabular-nums text-white">
                {SEGMENTS[hover].value.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend on right */}
      <div className="flex flex-col gap-5">
        <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-[var(--color-primary-50)]">
          Respondents
        </span>
        <h4 className="text-[clamp(22px,2.4vw,30px)] font-semibold leading-[1.3] text-white">
          다양한 직군이 응답에 참여했어요
        </h4>
        <ul className="mt-4 flex flex-col gap-3.5">
          {SEGMENTS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={[
                'flex items-center gap-4 rounded-md px-2 py-1 transition-colors',
                hover === i ? 'bg-white/[0.04]' : '',
              ].join(' ')}
            >
              <span className="block h-3 w-3 flex-none rounded-sm" style={{ background: s.color }} />
              <span className="flex-1 text-[15px] text-[var(--color-text-muted)]">{s.label}</span>
              <span className="text-[18px] font-semibold tabular-nums text-white">
                {s.value.toFixed(1)}%
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
