'use client';

import { motion } from 'framer-motion';

export function PosterCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-colors hover:border-white/[0.18] hover:bg-white/[0.05]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary-50)]/15 text-[var(--color-primary-50)]">
            <PosterIcon />
          </span>
          <div>
            <p className="text-[12.5px] font-medium text-white">flowMeet 포스터</p>
          </div>
        </div>
        <span className="rounded-full border border-white/[0.08] bg-black/40 px-2 py-0.5 text-[10px] text-[var(--color-text-dim)]">
          A1 · PDF
        </span>
      </div>

      {/* Poster Preview */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-[#0c0e12] via-[#0a0d12] to-[#0a0d12] p-8">
        <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-25" />
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_50%,rgba(4,230,162,0.12),transparent)]" />

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-[707/1000] w-full max-w-[260px] overflow-hidden rounded-xl bg-[#050608] shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        >
          <PosterMock />
        </motion.div>
      </div>

      <div className="flex items-center gap-3 border-t border-white/[0.06] bg-black/30 px-5 py-3.5">
        <div className="flex-1">
          <p className="text-[12px] font-medium text-white">flowMeet_poster_v1.pdf</p>
          <p className="text-[10.5px] text-[var(--color-text-dim)]">2.4 MB · A1 (594 × 841 mm)</p>
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

function PosterMock() {
  return (
    <svg viewBox="0 0 240 340" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id="poster-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0d12" />
          <stop offset="100%" stopColor="#050608" />
        </linearGradient>
        <radialGradient id="poster-glow" cx="50%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#04e6a2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#04e6a2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="340" fill="url(#poster-bg)" />
      <circle cx="120" cy="120" r="120" fill="url(#poster-glow)" />

      {/* dotted grid */}
      <g opacity="0.18">
        {Array.from({ length: 14 }).flatMap((_, ri) =>
          Array.from({ length: 10 }).map((_, ci) => (
            <circle key={`${ri}-${ci}`} cx={20 + ci * 22} cy={20 + ri * 22} r="0.7" fill="#fff" />
          )),
        )}
      </g>

      {/* Top tag */}
      <rect x="22" y="20" width="46" height="12" rx="6" fill="#04e6a2" fillOpacity="0.18" stroke="#04e6a2" strokeOpacity="0.5" />
      <text x="45" y="29" textAnchor="middle" fontSize="6" fill="#04e6a2" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        KMU 2026
      </text>

      {/* Title */}
      <text x="22" y="80" fontSize="20" fontWeight="700" fill="#ffffff" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        기획이 흐름을
      </text>
      <text x="22" y="106" fontSize="20" fontWeight="700" fill="#ffffff" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        만나는 순간,
      </text>
      <text x="22" y="138" fontSize="22" fontWeight="800" fill="#04e6a2" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        flowMeet
      </text>

      {/* Tagline */}
      <text x="22" y="160" fontSize="7" fill="rgba(255,255,255,0.55)" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        노드 플로우 · 회의 요약 · AI 에이전트
      </text>

      {/* Mini node flow */}
      <g transform="translate(20, 180)">
        <rect x="0" y="0" width="48" height="22" rx="4" fill="#04e6a2" />
        <text x="24" y="14" textAnchor="middle" fontSize="6" fill="#062018" fontFamily="Pretendard Variable, Pretendard, sans-serif" fontWeight="600">
          기획
        </text>
        <line x1="48" y1="11" x2="76" y2="11" stroke="#04e6a2" strokeOpacity="0.6" strokeWidth="0.8" />
        <rect x="76" y="0" width="48" height="22" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
        <text x="100" y="14" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="Pretendard Variable, Pretendard, sans-serif">
          회의
        </text>
        <line x1="124" y1="11" x2="152" y2="11" stroke="#04e6a2" strokeOpacity="0.6" strokeWidth="0.8" />
        <rect x="152" y="0" width="48" height="22" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
        <text x="176" y="14" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="Pretendard Variable, Pretendard, sans-serif">
          AI
        </text>
      </g>

      {/* Stats */}
      <g transform="translate(22, 230)">
        <text fontSize="5.5" fill="rgba(255,255,255,0.4)" fontFamily="Pretendard Variable, Pretendard, sans-serif" letterSpacing="1">
          SURVEY · N=129
        </text>
        <text y="16" fontSize="14" fontWeight="700" fill="#04e6a2" fontFamily="Pretendard Variable, Pretendard, sans-serif">
          75.2%
        </text>
        <text y="26" fontSize="5.5" fill="rgba(255,255,255,0.6)" fontFamily="Pretendard Variable, Pretendard, sans-serif">
          시각적 다이어그램 기능 기대
        </text>
      </g>

      <g transform="translate(120, 230)">
        <text fontSize="5.5" fill="rgba(255,255,255,0.4)" fontFamily="Pretendard Variable, Pretendard, sans-serif" letterSpacing="1">
          INTENT
        </text>
        <text y="16" fontSize="14" fontWeight="700" fill="#04e6a2" fontFamily="Pretendard Variable, Pretendard, sans-serif">
          91.5%
        </text>
        <text y="26" fontSize="5.5" fill="rgba(255,255,255,0.6)" fontFamily="Pretendard Variable, Pretendard, sans-serif">
          시각화 도구 도입 의향
        </text>
      </g>

      {/* Bottom team mark */}
      <rect x="22" y="295" width="196" height="22" rx="4" fill="rgba(4,230,162,0.06)" stroke="rgba(4,230,162,0.25)" />
      <text x="120" y="309" textAnchor="middle" fontSize="6.5" fill="#04e6a2" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        KMU CAPSTONE 2026 · TEAM 09
      </text>
    </svg>
  );
}

function PosterIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3" y="2" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 5h5M5.5 8h5M5.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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
