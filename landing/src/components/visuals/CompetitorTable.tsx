'use client';

import { motion } from 'framer-motion';

interface Row {
  tool: string;
  visualization: 'O' | 'X' | '△';
  meeting: 'O' | 'X' | '△';
  ai: 'O' | 'X' | '△';
  limitation: string;
  highlight?: boolean;
}

const ROWS: Row[] = [
  { tool: 'Notion', visualization: 'X', meeting: 'X', ai: '△', limitation: '구조적 분기 표현이 어려워요' },
  { tool: 'Figjam', visualization: 'O', meeting: 'X', ai: 'X', limitation: '회의나 의사결정과 분리돼요' },
  { tool: 'Jira', visualization: '△', meeting: 'X', ai: 'X', limitation: '아이데이션에 맞지 않아요' },
  { tool: 'Google Meet', visualization: 'X', meeting: '△', ai: 'X', limitation: '결정사항이 흩어져요' },
  { tool: 'flowMeet', visualization: 'O', meeting: 'O', ai: 'O', limitation: '하나의 흐름으로 연결돼요', highlight: true },
];

export function CompetitorTable() {
  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <div className="grid min-w-[720px] grid-cols-[1.4fr_0.7fr_0.9fr_0.7fr_2fr] gap-4 border-b border-white/[0.10] px-6 py-5 text-[13px] uppercase tracking-[0.16em] text-[var(--color-text-dim)]">
        <span>도구</span>
        <span className="text-center">시각화</span>
        <span className="text-center">회의 정리</span>
        <span className="text-center">맥락 AI</span>
        <span>한계 / 차별점</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {ROWS.map((row, idx) => (
          <motion.div
            key={row.tool}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: idx * 0.06 }}
            className={[
              'group relative grid min-w-[720px] grid-cols-[1.4fr_0.7fr_0.9fr_0.7fr_2fr] items-center gap-4 px-6 py-5 transition-colors',
              row.highlight ? 'bg-[var(--color-primary-50)]/[0.06]' : 'hover:bg-white/[0.025]',
            ].join(' ')}
          >
            {row.highlight && (
              <span className="absolute inset-y-0 left-0 w-[2px] bg-[var(--color-primary-50)]" />
            )}
            <span
              className={[
                'text-[15px] font-semibold',
                row.highlight ? 'text-[var(--color-primary-50)]' : 'text-white',
              ].join(' ')}
            >
              {row.tool}
            </span>
            <Mark v={row.visualization} />
            <Mark v={row.meeting} />
            <Mark v={row.ai} />
            <span className="text-[13.5px] text-[var(--color-text-muted)]">{row.limitation}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Mark({ v }: { v: 'O' | 'X' | '△' }) {
  if (v === 'O') {
    return (
      <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-primary-50)]/40 bg-[var(--color-primary-50)]/15 text-[var(--color-primary-50)]">
        <CheckIcon />
      </span>
    );
  }
  if (v === 'X') {
    return (
      <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-[var(--color-text-faint)]">
        <CloseIcon />
      </span>
    );
  }
  return (
    <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-[var(--color-text-dim)]">
      <DotIcon />
    </span>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="m3 8 3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotIcon() {
  return <span className="block h-1.5 w-1.5 rounded-full bg-current" />;
}
