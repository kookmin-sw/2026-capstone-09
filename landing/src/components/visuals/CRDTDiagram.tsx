'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  { id: 1, label: '문서 수정', detail: '클라이언트에서 노드·문서 편집' },
  { id: 2, label: 'Update 생성', detail: 'Yjs가 변경 내용을 binary update로' },
  { id: 3, label: 'WebSocket 전송', detail: 'WSS 서버가 update 수신' },
  { id: 4, label: 'Broadcast', detail: '모든 동시 편집자에게 전파' },
  { id: 5, label: 'Persist', detail: 'Spring Boot가 영속화' },
];

export function CRDTDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setActive(1);
    const id = setInterval(() => {
      setActive((s) => (s % STEPS.length) + 1);
    }, 1500);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0d12]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary-50)]">
            CRDT · Conflict-free Replicated Data Type
          </p>
          <p className="mt-0.5 text-[14px] text-white">
            동시 편집해도 충돌 없이 동일한 최종 상태로 수렴
          </p>
        </div>
        <span className="rounded-full border border-[var(--color-primary-50)]/30 bg-[var(--color-primary-50)]/[0.06] px-2.5 py-1 text-[10px] tracking-[0.15em] text-[var(--color-primary-50)]">
          Yjs · WSS
        </span>
      </div>

      <div className="relative h-[440px]">
        <div className="bg-grid-fine absolute inset-0 opacity-25" />

        <svg viewBox="0 0 1080 380" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="crdt-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#04e6a2" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#04e6a2" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Step labels above */}
          <NumberStep n="01" label="Yjs document 수정" x={140} y={50} active={active >= 1} />
          <NumberStep n="02" label="Update 생성" x={380} y={50} active={active >= 2} />
          <NumberStep n="03" label="WebSocket 전송" x={600} y={50} active={active >= 3} />
          <NumberStep n="04" label="Broadcast" x={860} y={50} active={active >= 4} />
          <NumberStep n="05" label="Spring Boot 영속화" x={960} y={260} active={active >= 5} />

          {/* Clients (left column) */}
          <Client x={60} y={120} who="Client A" active={active === 1 || active === 4} />
          <Client x={60} y={200} who="Client B" active={active === 4} dim />
          <Client x={60} y={280} who="Client C" active={active === 4} dim />

          {/* Update bubble */}
          <UpdateBubble x={300} y={180} active={active >= 2} />

          {/* WSS */}
          <WSS x={520} y={170} active={active >= 3} />

          {/* Server stack + storage */}
          <ServerStack x={820} y={250} active={active >= 5} />
          <Storage x={1010} y={278} active={active >= 5} />

          {/* Edges */}
          <Edge d="M 200 145 C 240 145, 240 195, 280 195" active={active >= 1} delay={0} />
          <Edge d="M 340 195 C 400 195, 400 195, 480 195" active={active >= 2} delay={0.3} />
          <Edge d="M 600 220 C 620 220, 620 80, 760 80" active={active >= 3} delay={0.4} dashed />
          <Edge d="M 600 220 C 620 220, 620 280, 760 280" active={active >= 3} delay={0.4} dashed />
          <Edge d="M 580 195 C 700 195, 700 280, 820 280" active={active >= 5} delay={0.6} />
          <Edge d="M 940 280 C 980 280, 980 290, 1020 290" active={active >= 5} delay={0.9} />

          {/* Broadcast arrows back */}
          <Edge d="M 760 80 C 480 80, 320 145, 200 145" active={active >= 4} delay={0.4} dashed reverse />
          <Edge d="M 760 280 C 480 280, 240 230, 200 225" active={active >= 4} delay={0.5} dashed reverse />
          <Edge d="M 760 280 C 480 280, 240 285, 200 290" active={active >= 4} delay={0.6} dashed reverse />
        </svg>
      </div>

      <div className="grid grid-cols-5 border-t border-white/[0.06]">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onMouseEnter={() => setActive(s.id)}
            className={[
              'flex flex-col items-start gap-1 border-r border-white/[0.06] px-4 py-3 text-left transition-colors last:border-r-0',
              active === s.id ? 'bg-[var(--color-primary-50)]/[0.08]' : 'hover:bg-white/[0.025]',
            ].join(' ')}
          >
            <span
              className={[
                'font-medium text-[10px] tracking-[0.2em]',
                active === s.id ? 'text-[var(--color-primary-50)]' : 'text-[var(--color-text-faint)]',
              ].join(' ')}
            >
              0{s.id} · {s.label.toUpperCase()}
            </span>
            <p
              className={[
                'text-[12px] leading-[1.5] transition-colors',
                active === s.id ? 'text-white' : 'text-[var(--color-text-muted)]',
              ].join(' ')}
            >
              {s.detail}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Client({ x, y, who, active, dim }: { x: number; y: number; who: string; active?: boolean; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.55 : 1}>
      <rect
        x={x}
        y={y - 25}
        width={140}
        height={50}
        rx={10}
        fill={active ? 'rgba(4,230,162,0.14)' : 'rgba(255,255,255,0.04)'}
        stroke={active ? 'rgba(4,230,162,0.5)' : 'rgba(255,255,255,0.1)'}
      />
      <circle cx={x + 14} cy={y - 8} r="3" fill={active ? '#04e6a2' : 'rgba(255,255,255,0.4)'} />
      <text x={x + 24} y={y - 4} fontSize="11" fill="rgba(255,255,255,0.55)" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        Client
      </text>
      <text x={x + 14} y={y + 16} fontSize="13" fontWeight="600" fill="#fff" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        {who}
      </text>
    </g>
  );
}

function UpdateBubble({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.85 }}
      transition={{ duration: 0.5 }}
      style={{ transformOrigin: `${x + 40}px ${y + 16}px` }}
    >
      <rect x={x} y={y - 4} width={80} height={36} rx={8} fill={active ? 'rgba(4,230,162,0.20)' : 'rgba(255,255,255,0.04)'} stroke={active ? 'rgba(4,230,162,0.55)' : 'rgba(255,255,255,0.1)'} />
      <text x={x + 40} y={y + 18} fontSize="11" fontFamily="Pretendard Variable, Pretendard, sans-serif" fill={active ? '#04e6a2' : 'rgba(255,255,255,0.5)'} textAnchor="middle">
        update.bin
      </text>
    </motion.g>
  );
}

function WSS({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <g>
      <circle cx={x + 30} cy={y + 30} r={36} fill={active ? 'rgba(4,230,162,0.14)' : 'rgba(255,255,255,0.04)'} stroke={active ? 'rgba(4,230,162,0.45)' : 'rgba(255,255,255,0.1)'} strokeWidth="1.2" />
      <text x={x + 30} y={y + 25} fontSize="10.5" fill="rgba(255,255,255,0.55)" fontFamily="Pretendard Variable, Pretendard, sans-serif" textAnchor="middle">
        WebSocket
      </text>
      <text x={x + 30} y={y + 42} fontSize="14" fontWeight="700" fill="#fff" fontFamily="Pretendard Variable, Pretendard, sans-serif" textAnchor="middle">
        WSS
      </text>
    </g>
  );
}

function ServerStack({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={120} height={60} rx={10} fill={active ? 'rgba(123,211,255,0.10)' : 'rgba(255,255,255,0.04)'} stroke={active ? 'rgba(123,211,255,0.40)' : 'rgba(255,255,255,0.1)'} />
      <text x={x + 12} y={y + 22} fontSize="11" fill="rgba(255,255,255,0.55)" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        API Server
      </text>
      <text x={x + 12} y={y + 44} fontSize="14" fontWeight="600" fill="#fff" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        Spring Boot
      </text>
    </g>
  );
}

function Storage({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="36" ry="10" fill={active ? 'rgba(199,184,255,0.20)' : 'rgba(255,255,255,0.05)'} stroke={active ? 'rgba(199,184,255,0.50)' : 'rgba(255,255,255,0.10)'} />
      <rect x={x - 36} y={y} width={72} height={22} fill={active ? 'rgba(199,184,255,0.14)' : 'rgba(255,255,255,0.03)'} stroke="none" />
      <ellipse cx={x} cy={y + 22} rx="36" ry="10" fill={active ? 'rgba(199,184,255,0.20)' : 'rgba(255,255,255,0.05)'} stroke={active ? 'rgba(199,184,255,0.50)' : 'rgba(255,255,255,0.10)'} />
      <text x={x} y={y + 14} textAnchor="middle" fontSize="10.5" fill="#fff" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        Permanent
      </text>
    </g>
  );
}

function NumberStep({ n, label, x, y, active }: { n: string; label: string; x: number; y: number; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="14" fill={active ? '#04e6a2' : 'rgba(255,255,255,0.06)'} stroke={active ? 'transparent' : 'rgba(255,255,255,0.12)'} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={active ? '#062018' : 'rgba(255,255,255,0.5)'} fontFamily="Pretendard Variable, Pretendard, sans-serif">
        {n}
      </text>
      <text x={x} y={y + 30} textAnchor="middle" fontSize="11" fill={active ? '#fff' : 'rgba(255,255,255,0.45)'} fontFamily="Pretendard Variable, Pretendard, sans-serif">
        {label}
      </text>
    </g>
  );
}

function Edge({
  d,
  active,
  delay,
  dashed,
  reverse,
}: {
  d: string;
  active: boolean;
  delay: number;
  dashed?: boolean;
  reverse?: boolean;
}) {
  return (
    <g>
      <path
        d={d}
        stroke={dashed ? 'rgba(255,255,255,0.18)' : 'url(#crdt-grad)'}
        strokeWidth={dashed ? '1.2' : '1.6'}
        strokeDasharray={dashed ? '4 5' : undefined}
        fill="none"
        opacity={active ? 1 : 0.25}
        style={{ transition: 'opacity 0.4s ease' }}
      />
      {active && !dashed && (
        <motion.circle
          r="2.5"
          fill="#04e6a2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay }}
        >
          <animateMotion dur="1.4s" repeatCount="indefinite" path={d} keyPoints={reverse ? '1;0' : '0;1'} keyTimes="0;1" />
        </motion.circle>
      )}
    </g>
  );
}
