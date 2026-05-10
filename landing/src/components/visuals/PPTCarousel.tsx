'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Slide {
  title: string;
  body: string;
  render: () => React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    title: 'Cover',
    body: 'KMU Capstone 2026 · Team 09',
    render: SlideCover,
  },
  {
    title: 'Pain Point',
    body: '정보 분산 · 구조 비가시성 · 이해도 불균형',
    render: SlidePain,
  },
  {
    title: 'Survey',
    body: '응답자 129명 · 핵심 기대 기능 75.2%',
    render: SlideSurvey,
  },
  {
    title: 'Solution',
    body: '노드 플로우 · 회의 요약 · AI 에이전트',
    render: SlideSolution,
  },
  {
    title: 'Architecture',
    body: '4-Tier · MCP · CRDT',
    render: SlideArch,
  },
];

export function PPTCarousel() {
  const [page, setPage] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPage((p) => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, [auto]);

  function go(p: number) {
    setAuto(false);
    setPage((p + SLIDES.length) % SLIDES.length);
  }

  const current = SLIDES[page];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-colors hover:border-white/[0.18] hover:bg-white/[0.05]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary-50)]/15 text-[var(--color-primary-50)]">
            <SlideIcon />
          </span>
          <div>
            <p className="text-[12.5px] font-medium text-white">flowMeet 발표 자료</p>
          </div>
        </div>
        <span className="rounded-full border border-white/[0.08] bg-black/40 px-2 py-0.5 text-[10px] text-[var(--color-text-dim)]">
          {String(page + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Slide viewport */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-[#0c0e12] via-[#0a0d12] to-[#0a0d12] p-6">
        <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-25" />

        <div className="relative aspect-[16/9] w-full max-w-[440px] overflow-hidden rounded-xl bg-[#050608] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {current.render()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / Next buttons */}
        <button
          onClick={() => go(page - 1)}
          aria-label="이전 슬라이드"
          className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.1] bg-black/60 text-white backdrop-blur transition-colors hover:border-[var(--color-primary-50)]/45 hover:text-[var(--color-primary-50)]"
        >
          <ArrowIcon className="rotate-180" />
        </button>
        <button
          onClick={() => go(page + 1)}
          aria-label="다음 슬라이드"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.1] bg-black/60 text-white backdrop-blur transition-colors hover:border-[var(--color-primary-50)]/45 hover:text-[var(--color-primary-50)]"
        >
          <ArrowIcon />
        </button>
      </div>

      {/* Indicator dots */}
      <div className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] bg-black/30 py-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`슬라이드 ${i + 1}: ${s.title}`}
            className={[
              'h-1.5 rounded-full transition-all',
              i === page ? 'w-6 bg-[var(--color-primary-50)]' : 'w-1.5 bg-white/15 hover:bg-white/30',
            ].join(' ')}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-white/[0.06] bg-black/30 px-5 py-3.5">
        <div className="flex-1 min-w-0">
          <p className="truncate text-[12px] font-medium text-white">flowMeet_slides_v1.pdf</p>
          <p className="text-[10.5px] text-[var(--color-text-dim)]">{SLIDES.length}개 슬라이드 · 8.7 MB</p>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-50)] px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-[var(--color-primary-50)]/90"
        >
          <DownloadIcon />
          다운로드
        </a>
      </div>
    </motion.div>
  );
}

/* ============== Slide renders ============== */

function SlideCover() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-6">
      <div className="absolute inset-0 [background:radial-gradient(70%_60%_at_30%_40%,rgba(4,230,162,0.16),transparent_70%)]" />
      <div className="relative">
        <span className="rounded-full border border-[var(--color-primary-50)]/40 bg-[var(--color-primary-50)]/10 px-2 py-0.5 text-[8px] tracking-[0.18em] text-[var(--color-primary-50)]">
          KMU 2026
        </span>
      </div>
      <div className="relative">
        <p className="text-[14px] font-semibold leading-[1.3] text-white">기획이 흐름을</p>
        <p className="text-[14px] font-semibold leading-[1.3] text-white">만나는 순간,</p>
        <p className="mt-1 text-[24px] font-bold text-[var(--color-primary-50)]">flowMeet</p>
        <p className="mt-2 text-[9.5px] text-[rgba(255,255,255,0.55)]">노드 플로우, 회의 요약, AI 에이전트를 한 흐름으로</p>
      </div>
      <div className="relative flex items-center justify-between text-[8px] text-[rgba(255,255,255,0.45)]">
        <span>Capstone Team 09</span>
        <span>v1 · 2026</span>
      </div>
    </div>
  );
}

function SlidePain() {
  const items = ['정보 분산', '구조 비가시성', '이해도 불균형'];
  return (
    <div className="relative flex h-full w-full flex-col gap-3 overflow-hidden p-6">
      <SlideHeader index="02" label="Pain Point" />
      <p className="text-[14px] font-semibold leading-[1.3] text-white">
        프로젝트를 진행하며 마주치는 순간들
      </p>
      <div className="mt-1 grid flex-1 grid-cols-3 gap-2">
        {items.map((it) => (
          <div key={it} className="flex flex-col justify-end rounded-md border border-rose-500/25 bg-rose-500/[0.06] p-2.5">
            <span className="block h-1 w-6 rounded-full bg-rose-300/60" />
            <p className="mt-2 text-[10px] font-semibold text-white">{it}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideSurvey() {
  return (
    <div className="relative flex h-full w-full flex-col gap-3 overflow-hidden p-6">
      <SlideHeader index="03" label="Survey" />
      <p className="text-[13px] font-semibold leading-[1.3] text-white">실제 사용자에게 직접 물어봤어요</p>
      <div className="mt-1 grid flex-1 grid-cols-2 gap-2">
        <SurveyStat percent="75.2%" label="시각적 다이어그램" />
        <SurveyStat percent="91.5%" label="시각화 도구 도입 의향" />
        <SurveyStat percent="50.4%" label="흐름이 잘 보이지 않아요" />
        <SurveyStat percent="46.5%" label="맥락 이해 AI" />
      </div>
    </div>
  );
}

function SurveyStat({ percent, label }: { percent: string; label: string }) {
  return (
    <div className="flex flex-col justify-end rounded-md border border-[var(--color-primary-50)]/30 bg-[var(--color-primary-50)]/[0.07] p-2.5">
      <span className="font-medium text-[14px] font-bold leading-none text-[var(--color-primary-50)]">{percent}</span>
      <p className="mt-1 text-[9.5px] text-[rgba(255,255,255,0.7)]">{label}</p>
    </div>
  );
}

function SlideSolution() {
  const items = [
    { num: '01', title: '노드 플로우', sub: '메인/서브 분기' },
    { num: '02', title: '회의 요약', sub: 'AI 자동 정리' },
    { num: '03', title: 'AI 에이전트', sub: '맥락 인식' },
  ];
  return (
    <div className="relative flex h-full w-full flex-col gap-3 overflow-hidden p-6">
      <SlideHeader index="04" label="Solution" />
      <p className="text-[13px] font-semibold leading-[1.3] text-white">하나의 흐름으로 묶어주는 협업 도구</p>
      <div className="mt-1 grid flex-1 grid-cols-3 gap-2">
        {items.map((it) => (
          <div key={it.num} className="flex flex-col justify-end rounded-md border border-[var(--color-primary-50)]/30 bg-[var(--color-primary-50)]/[0.07] p-2.5">
            <span className="font-medium text-[10px] tracking-[0.18em] text-[var(--color-primary-50)]">{it.num}</span>
            <p className="mt-1 text-[10px] font-semibold text-white">{it.title}</p>
            <p className="text-[8.5px] text-[rgba(255,255,255,0.55)]">{it.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideArch() {
  const tiers = ['Client', 'Gateway', 'Service', 'Storage'];
  return (
    <div className="relative flex h-full w-full flex-col gap-3 overflow-hidden p-6">
      <SlideHeader index="05" label="Architecture" />
      <p className="text-[13px] font-semibold leading-[1.3] text-white">4-Tier · MCP · CRDT</p>
      <div className="mt-1 flex flex-1 flex-col gap-1">
        {tiers.map((t, i) => (
          <div
            key={t}
            className="flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1"
          >
            <span className="font-medium text-[9px] text-[var(--color-text-faint)]">T{String(i + 1).padStart(2, '0')}</span>
            <span className="text-[10.5px] font-medium text-white">{t}</span>
            <span className="ml-auto h-1 w-12 rounded-full bg-[var(--color-primary-50)]/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideHeader({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-[9px] tracking-[0.2em] text-[var(--color-primary-50)]">
        {index} · {label.toUpperCase()}
      </span>
      <span className="font-medium text-[8px] text-[rgba(255,255,255,0.3)]">flowMeet</span>
    </div>
  );
}

function SlideIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-3.5 w-3.5 ${className}`} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5 8h7m0 0L8.5 4.5M12 8 8.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2v8m0 0 3-3m-3 3-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12v1.5A1.5 1.5 0 0 0 4.5 15h7A1.5 1.5 0 0 0 13 13.5V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
