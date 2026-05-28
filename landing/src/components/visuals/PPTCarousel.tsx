'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';

interface Slide {
  src: string;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  { src: '/slides/slide-01.jpg', title: 'Cover', body: '기획이 흐름을 만나는 순간, flowMeet' },
  { src: '/slides/slide-03.jpg', title: 'Pain Point', body: '이런 상황, 겪어보셨나요?' },
  { src: '/slides/slide-08.jpg', title: 'Survey', body: '설문조사 결과' },
  { src: '/slides/slide-12.jpg', title: 'Solution', body: '플로밋의 메인 기능 3가지' },
  { src: '/slides/slide-15.jpg', title: 'Node Flow', body: '노드 플로우 뷰' },
  { src: '/slides/slide-19.jpg', title: 'AI Meeting', body: '회의 생성, 참여 및 AI 회의 요약' },
  { src: '/slides/slide-22.jpg', title: 'AI Agent', body: 'AI 챗봇' },
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

        <div className="relative aspect-[16/9] w-full max-w-[440px] overflow-hidden rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            <motion.img
              key={page}
              src={asset(current.src)}
              alt={current.body}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
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
          <p className="truncate text-[12px] font-medium text-white">플로밋.pdf</p>
          <p className="text-[10.5px] text-[var(--color-text-dim)]">{SLIDES.length}개 슬라이드 · 31 pages</p>
        </div>
        <a
          href={asset('/플로밋.pdf')}
          download
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-50)] px-4 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-[var(--color-primary-50)]/90"
        >
          <DownloadIcon />
          다운로드
        </a>
      </div>
    </motion.div>
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
