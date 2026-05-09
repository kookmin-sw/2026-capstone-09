'use client';

import { motion } from 'framer-motion';

const PAIRS = [
  {
    problem: '정보 분산',
    problemSub: '메신저, 문서, 회의록에 흩어져 있어요',
    solution: '노드를 한 번에 보여줘요',
    solutionSub: '흩어진 내용을 한곳에서 확인해요',
    icon: 'scatter',
  },
  {
    problem: '구조 비가시성',
    problemSub: '텍스트 중심으로 흐름이 잘 보이지 않아요',
    solution: '메인/서브 노드 분기',
    solutionSub: '아이디어 갈래를 시각화해요',
    icon: 'flow',
  },
  {
    problem: '이해도 불균형',
    problemSub: '같은 맥락을 반복해서 설명해요',
    solution: '맥락 이해 AI 에이전트',
    solutionSub: '@로 노드나 사용자를 불러와요',
    icon: 'gap',
  },
];

export function ProblemSolutionFlow() {
  return (
    <div className="relative px-2 py-6 lg:px-6 lg:py-10">
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full bg-rose-500/[0.10] blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[var(--color-primary-50)]/[0.16] blur-[140px]" />

      <div className="relative flex flex-col gap-5 lg:hidden">
        {PAIRS.map((pair, index) => (
          <MobileCard
            key={pair.problem}
            variant="problem"
            pair={pair}
            index={index}
          />
        ))}
        <div className="flex justify-center py-2 text-[var(--color-primary-50)]">
          <DownArrow />
        </div>
        {PAIRS.map((pair, index) => (
          <MobileCard
            key={pair.solution}
            variant="solution"
            pair={pair}
            index={index}
          />
        ))}
      </div>

      <div className="relative hidden grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-10 gap-y-9 lg:grid">
        {/* Header row */}
        <div className="flex items-center gap-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-rose-400/70" />
          <h4 className="text-[11px] uppercase tracking-[0.22em] text-rose-300/80">기존 방식의 문제</h4>
        </div>
        <div className="flex justify-center">
          <span className="font-medium text-[10px] tracking-[0.25em] text-[var(--color-primary-50)]">
            SOLUTION
          </span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <h4 className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-primary-50)]">
            flowMeet의 해결
          </h4>
          <span className="block h-1.5 w-1.5 rounded-full bg-[var(--color-primary-50)]" />
        </div>

        {/* Pair rows */}
        {PAIRS.map((pair, i) => (
          <PairRow key={i} pair={pair} index={i} />
        ))}
      </div>
    </div>
  );
}

function PairRow({ pair, index }: { pair: (typeof PAIRS)[number]; index: number }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: index * 0.12 }}
        className="flex items-center gap-3 sm:gap-5"
      >
        <Orb variant="problem" index={index} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[10px] tracking-[0.18em] text-rose-300/70">
            PROBLEM · {String(index + 1).padStart(2, '0')}
          </p>
          <h5 className="mt-1.5 text-[17px] font-semibold leading-[1.3] text-white">{pair.problem}</h5>
          <p className="mt-1 text-[12.5px] text-[var(--color-text-muted)]">{pair.problemSub}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.12 }}
        className="flex items-center justify-center"
      >
        <FlowArrow />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.12 }}
        className="flex flex-row-reverse items-center gap-3 text-right sm:gap-5"
      >
        <Orb variant="solution" index={index} icon={pair.icon} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[10px] tracking-[0.18em] text-[var(--color-primary-50)]">
            FLOWMEET · {String(index + 1).padStart(2, '0')}
          </p>
          <h5 className="mt-1.5 text-[17px] font-semibold leading-[1.3] text-white">{pair.solution}</h5>
          <p className="mt-1 text-[12.5px] text-[var(--color-text-muted)]">{pair.solutionSub}</p>
        </div>
      </motion.div>
    </>
  );
}

function MobileCard({
  variant,
  pair,
  index,
}: {
  variant: 'problem' | 'solution';
  pair: (typeof PAIRS)[number];
  index: number;
}) {
  const isSolution = variant === 'solution';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className={[
        'flex items-center gap-4 rounded-3xl border p-5',
        isSolution
          ? 'border-[var(--color-primary-50)]/20 bg-[var(--color-primary-50)]/[0.06]'
          : 'border-white/[0.08] bg-white/[0.03]',
      ].join(' ')}
    >
      <Orb variant={variant} index={index} icon={pair.icon} />
      <div className="min-w-0 flex-1">
        <p
          className={[
            'font-medium text-[10px] tracking-[0.18em]',
            isSolution ? 'text-[var(--color-primary-50)]' : 'text-rose-300/70',
          ].join(' ')}
        >
          {isSolution ? 'FLOWMEET' : 'PROBLEM'} · {String(index + 1).padStart(2, '0')}
        </p>
        <h5 className="mt-1.5 text-[18px] font-semibold leading-[1.3] text-white">
          {isSolution ? pair.solution : pair.problem}
        </h5>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
          {isSolution ? pair.solutionSub : pair.problemSub}
        </p>
      </div>
    </motion.div>
  );
}

function DownArrow() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4v14m0 0 5-5m-5 5-5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Orb({
  variant,
  index,
  icon,
}: {
  variant: 'problem' | 'solution';
  index: number;
  icon?: string;
}) {
  const isSolution = variant === 'solution';
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="relative h-16 w-16 flex-none sm:h-[88px] sm:w-[88px]"
    >
      <div
        className={[
          'absolute -inset-3 rounded-full blur-2xl opacity-70',
          isSolution ? 'bg-[var(--color-primary-50)]/40' : 'bg-rose-500/35',
        ].join(' ')}
      />
      <div
        className={[
          'absolute inset-0 rounded-full',
          isSolution
            ? 'bg-[radial-gradient(circle_at_30%_30%,rgba(4,230,162,0.95),rgba(2,160,122,0.65)_55%,rgba(1,77,59,0.95))]'
            : 'bg-[radial-gradient(circle_at_30%_30%,rgba(255,127,140,0.85),rgba(225,29,72,0.7)_55%,rgba(120,16,42,0.95))]',
        ].join(' ')}
      />
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/15 to-transparent" />
      <div className="absolute left-3 top-3 h-5 w-5 rounded-full bg-white/35 blur-sm" />
      <div
        className={[
          'absolute inset-[10px] rounded-full border',
          isSolution ? 'border-[var(--color-primary-50)]/40' : 'border-rose-300/30',
        ].join(' ')}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {isSolution ? <SolutionIcon name={icon ?? 'scatter'} /> : <CrossIcon />}
        <span className="font-medium text-[9.5px] font-bold tracking-[0.2em] text-white/90">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  );
}

function FlowArrow() {
  return (
    <svg className="w-10 sm:w-24 lg:w-[140px]" height="40" viewBox="0 0 140 40" fill="none" aria-hidden>
      <defs>
        <linearGradient id="flow-arrow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF8FA3" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#04e6a2" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#04e6a2" stopOpacity="1" />
        </linearGradient>
      </defs>
      <motion.path
        d="M5 20 H125 m-9 -7 l9 7 -9 7"
        stroke="url(#flow-arrow-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5 text-white" fill="none" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SolutionIcon({ name }: { name: string }) {
  if (name === 'scatter') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden>
        <circle cx="6" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="18" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="6" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="19" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === 'flow') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden>
        <path d="M3 7h7m4 0h7M3 12h12m3 0h3M3 17h6m3 0h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden>
      <path d="M12 3l1.8 4.6 4.7 1.8-4.7 1.8L12 16l-1.8-4.8L5.5 9.4l4.7-1.8L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
