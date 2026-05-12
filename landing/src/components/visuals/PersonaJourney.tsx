'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Stage {
  stage: string;
  mood: number;
  emoji: string;
  pain?: ReactNode;
}

const STAGES: Stage[] = [
  {
    stage: '논의 시작',
    mood: 0.82,
    emoji: '😀',
  },
  {
    stage: '아이디어 분기',
    mood: 0.62,
    emoji: '🙂',
    pain: (
      <>
        여러 안이 동시에 나올 때,
        <br />
        어디가 어떤 갈래인지
        <br />
        텍스트로는 보이지 않아요
      </>
    ),
  },
  {
    stage: '결정·정리',
    mood: 0.42,
    emoji: '😟',
    pain: (
      <>
        결정 사항이 회의록과
        <br />
        메신저로 흩어져,
        <br />
        누가 정리하는지도 불분명해요
      </>
    ),
  },
  {
    stage: '회의록 정리',
    mood: 0.36,
    emoji: '😔',
    pain: (
      <>
        논의 흐름과 결정 이유를
        <br />
        다시 짜맞추는 데 시간이 들어요
      </>
    ),
  },
  {
    stage: '재논의 공유',
    mood: 0.18,
    emoji: '😣',
    pain: (
      <>
        새 팀원에게 같은 맥락을
        <br />
        회의마다 다시 설명해야 해요
      </>
    ),
  },
  {
    stage: '히스토리 추적',
    mood: 0.30,
    emoji: '😢',
    pain: (
      <>
        이전 결정의 배경과 근거를
        <br />
        추적할 단서가 부족해요
      </>
    ),
  },
];

export function PersonaJourney() {
  const w = 1100;
  const padX = 80;
  const padTop = 50;
  const padBottom = 30;
  const chartH = 230;
  const innerW = w - padX * 2;
  const innerH = chartH - padTop - padBottom;

  const points = STAGES.map((s, i) => ({
    x: padX + (innerW * i) / (STAGES.length - 1),
    y: padTop + innerH * (1 - s.mood),
  }));

  const path =
    `M ${points[0].x} ${points[0].y} ` +
    points
      .slice(1)
      .map((p, i) => {
        const prev = points[i];
        const midX = (prev.x + p.x) / 2;
        return `C ${midX} ${prev.y}, ${midX} ${p.y}, ${p.x} ${p.y}`;
      })
      .join(' ');
  const fillPath = `${path} L ${points[points.length - 1].x} ${padTop + innerH} L ${points[0].x} ${padTop + innerH} Z`;

  return (
    <div className="relative">
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-15" />
      <div className="pointer-events-none absolute -top-24 right-0 h-[320px] w-[320px] rounded-full bg-[var(--color-primary-50)]/[0.08] blur-[120px]" />

      <div className="relative">
        <div className="flex flex-col gap-3">
          <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-[var(--color-primary-50)]">
            User Journey Map
          </span>
          <h4 className="text-[clamp(22px,2.6vw,30px)] font-semibold leading-[1.3] text-white">
            프로젝트 흐름에 따라 감정과 어려움이 이렇게 변해요
          </h4>
        </div>

        <div className="mt-7 grid grid-cols-6 gap-2">
          {STAGES.map((s, i) => (
            <motion.div
              key={s.stage}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.05 }}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--color-primary-50)]/25 bg-[var(--color-primary-50)]/[0.06] px-2 py-2.5"
            >
              <span className="font-medium text-[10px] tracking-[0.2em] text-[var(--color-primary-50)]">
                STEP {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[12.5px] font-medium text-white">{s.stage}</span>
            </motion.div>
          ))}
        </div>

        <div className="relative mt-6 overflow-x-auto">
          <svg viewBox={`0 0 ${w} ${chartH}`} className="min-w-[820px] w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="journey-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#04e6a2" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#04e6a2" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="journey-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#04e6a2" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#04e6a2" stopOpacity="1" />
              </linearGradient>
            </defs>
            <line x1={padX} y1={padTop} x2={w - padX} y2={padTop} stroke="rgba(255,255,255,0.06)" />
            <line x1={padX} y1={padTop + innerH / 2} x2={w - padX} y2={padTop + innerH / 2} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 4" />
            <line x1={padX} y1={padTop + innerH} x2={w - padX} y2={padTop + innerH} stroke="rgba(255,255,255,0.06)" />

            <text x={padX - 40} y={padTop + 4} fontSize="10.5" fill="rgba(255,255,255,0.4)" fontFamily="Pretendard Variable, Pretendard, sans-serif">Good</text>
            <text x={padX - 40} y={padTop + innerH + 4} fontSize="10.5" fill="rgba(255,255,255,0.4)" fontFamily="Pretendard Variable, Pretendard, sans-serif">Bad</text>

            <motion.path
              d={fillPath}
              fill="url(#journey-fill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.path
              d={path}
              stroke="url(#journey-line)"
              strokeWidth="2.4"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />

            {points.map((p, i) => (
              <line
                key={`v-${i}`}
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={padTop + innerH}
                stroke="rgba(4,230,162,0.18)"
                strokeWidth="0.8"
                strokeDasharray="2 4"
              />
            ))}

            {points.map((p, i) => (
              <motion.g
                key={`emoji-${i}`}
                initial={{ opacity: 0, y: -6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.0 + i * 0.07 }}
              >
                <circle cx={p.x} cy={p.y} r="20" fill="#0a0d12" stroke="rgba(4,230,162,0.6)" strokeWidth="1.6" />
                <text
                  x={p.x}
                  y={p.y + 7}
                  textAnchor="middle"
                  fontSize="22"
                  fontFamily="'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif"
                >
                  {STAGES[i].emoji}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>

        {/* Painpoint row — Start narrow, painpoint wider */}
        <div className="mt-3 grid grid-cols-[0.55fr_repeat(5,1fr)] gap-2">
          {STAGES.map((s, i) => (
            <motion.div
              key={`pain-${i}`}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
              className={[
                'rounded-lg border px-3 py-2.5 text-[11.5px] leading-[1.55]',
                s.pain
                  ? 'border-rose-500/25 bg-rose-500/[0.06] text-[var(--color-text-muted)]'
                  : 'border-[var(--color-primary-50)]/20 bg-[var(--color-primary-50)]/[0.04] text-[var(--color-text-muted)]',
              ].join(' ')}
            >
              {s.pain ? (
                <>
                  <p className="mb-1 text-[9.5px] uppercase tracking-[0.18em] text-rose-300/80">Painpoint</p>
                  <p>{s.pain}</p>
                </>
              ) : (
                <>
                  <p className="mb-1 text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-primary-50)]">Start</p>
                  <p>프로젝트 시작</p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
