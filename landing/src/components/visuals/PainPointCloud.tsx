'use client';

import { motion } from 'framer-motion';

interface PainNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

const PAINS: PainNode[] = [
  { id: 'p1', label: '정보 분산', x: 18, y: 32, size: 'lg', highlight: true },
  { id: 'p2', label: '구조 비가시성', x: 52, y: 22, size: 'lg', highlight: true },
  { id: 'p3', label: '이해도 불균형', x: 82, y: 36, size: 'lg', highlight: true },
  { id: 'p4', label: '최신 버전 추적', x: 14, y: 64, size: 'sm' },
  { id: 'p5', label: '결정 맥락 휘발', x: 42, y: 70, size: 'md', highlight: true },
  { id: 'p6', label: '신규 합류자 onboarding', x: 80, y: 72, size: 'sm' },
  { id: 'p7', label: '회의 설명 반복', x: 30, y: 50, size: 'sm' },
  { id: 'p8', label: '문서 검색 시간 소모', x: 66, y: 52, size: 'sm' },
];

const EDGES: [string, string][] = [
  ['p1', 'p2'],
  ['p2', 'p3'],
  ['p1', 'p7'],
  ['p2', 'p7'],
  ['p2', 'p8'],
  ['p3', 'p8'],
  ['p7', 'p4'],
  ['p7', 'p5'],
  ['p8', 'p5'],
  ['p8', 'p6'],
  ['p4', 'p5'],
  ['p5', 'p6'],
  ['p1', 'p4'],
  ['p3', 'p6'],
];

export function PainPointCloud() {
  const byId = Object.fromEntries(PAINS.map((p) => [p.id, p]));

  return (
    <div className="relative h-[340px] w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_55%_at_50%_50%,rgba(4,230,162,0.08),transparent_70%)]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {EDGES.map(([a, b], i) => {
          const A = byId[a];
          const B = byId[b];
          return (
            <motion.line
              key={i}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="rgba(4,230,162,0.22)"
              strokeWidth="0.15"
              strokeDasharray="0.4 0.6"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.1, delay: 0.6 + i * 0.06, ease: 'easeOut' }}
            />
          );
        })}
      </svg>

      {PAINS.map((p, i) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, scale: 0.7, y: 8 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06 }}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          className={[
            'absolute -translate-x-1/2 -translate-y-1/2 cursor-default whitespace-nowrap rounded-full border backdrop-blur transition-colors',
            p.size === 'lg'
              ? 'px-5 py-2 text-[15px] font-semibold'
              : p.size === 'md'
                ? 'px-4 py-1.5 text-[13.5px] font-medium'
                : 'px-3 py-1 text-[12px]',
            p.highlight
              ? 'border-[var(--color-primary-50)]/40 bg-[var(--color-primary-50)]/[0.10] text-white shadow-[0_0_28px_rgba(4,230,162,0.18)] hover:bg-[var(--color-primary-50)]/[0.18] hover:border-[var(--color-primary-50)]/65'
              : 'border-white/[0.1] bg-white/[0.04] text-[var(--color-text-muted)] hover:bg-white/[0.08] hover:text-white',
          ].join(' ')}
        >
          {p.label}
        </motion.span>
      ))}
    </div>
  );
}
