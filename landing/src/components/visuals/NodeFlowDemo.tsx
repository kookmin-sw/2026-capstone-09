'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ServiceMockShell } from './ServiceMockShell';

interface FlowNode {
  id: string;
  x: number;
  y: number;
  index: string;
  title: string;
  variant: 'main' | 'sub';
  selected?: boolean;
  appearAt: number; // step at which it appears
}

interface FlowEdge {
  from: string;
  to: string;
  appearAt: number;
}

const NODES: FlowNode[] = [
  { id: 'm1', x: 60, y: 80, index: '#1', title: '회의 기능 전면 개편', variant: 'main', appearAt: 1 },
  { id: 'm2', x: 700, y: 80, index: '#2', title: 'AI 어시스턴트 고도화', variant: 'main', appearAt: 2 },
  { id: 's1', x: 60, y: 240, index: '#1.1', title: 'Google Meet 연동 강화', variant: 'sub', appearAt: 3 },
  { id: 's2', x: 380, y: 240, index: '#1.1.1', title: 'Meet 권한 범위 재설계', variant: 'sub', selected: true, appearAt: 4 },
];

const EDGES: FlowEdge[] = [
  { from: 'm1', to: 's1', appearAt: 3 },
  { from: 's1', to: 's2', appearAt: 4 },
];

const NODE_W = 220;
const NODE_H = 80;
const STEPS = ['', '메인 노드 #1 생성', '메인 노드 #2 생성', '서브 노드 #1.1 생성', '서브의 서브 #1.1.1 생성', '플로우 완성 ✨'];

export function NodeFlowDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % 6);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const visibleNodes = NODES.filter((n) => step >= n.appearAt);
  const visibleEdges = EDGES.filter((e) => step >= e.appearAt);

  return (
    <div ref={ref}>
      <ServiceMockShell url="flowmeet.kr / 플로밋 기획" height={620}>
        <div className="absolute inset-0 grid grid-cols-[180px_1fr]">
          <Sidebar />
          <div className="relative flex min-w-0 flex-col">
            <Toolbar />
            <ProjectLinks />
            <FloatingActions step={step} />
            <div className="relative flex-1 overflow-hidden bg-[#FAFAFB]">
              <CanvasGrid />

              <svg
                viewBox="0 0 980 510"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Edges */}
                <AnimatePresence>
                  {visibleEdges.map((edge) => {
                    const a = NODES.find((n) => n.id === edge.from)!;
                    const b = NODES.find((n) => n.id === edge.to)!;
                    const ax = a.x + NODE_W;
                    const ay = a.y + NODE_H / 2;
                    const bx = b.x;
                    const by = b.y + NODE_H / 2;
                    const midX = (ax + bx) / 2;
                    const path = `M ${ax} ${ay} C ${midX} ${ay}, ${midX} ${by}, ${bx} ${by}`;
                    return (
                      <motion.path
                        key={`${edge.from}-${edge.to}`}
                        d={path}
                        stroke="#04E6A2"
                        strokeWidth="1.6"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                    );
                  })}
                </AnimatePresence>

                {/* Horizontal connection between #1 and #2 main nodes */}
                {step >= 2 && (
                  <motion.line
                    x1={NODES[0].x + NODE_W}
                    y1={NODES[0].y + NODE_H / 2}
                    x2={NODES[1].x}
                    y2={NODES[1].y + NODE_H / 2}
                    stroke="#C7CAD0"
                    strokeWidth="1.4"
                    strokeDasharray="4 5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  />
                )}

                {/* Nodes */}
                <AnimatePresence>
                  {visibleNodes.map((n) => (
                    <ServiceNode key={n.id} node={n} />
                  ))}
                </AnimatePresence>
              </svg>

              {/* Cursor showing button click */}
              <CursorPointer step={step} />

              <ChatbotIcon />
              <UserBadge />

              {/* Step indicator */}
              <motion.div
                key={step}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-5 top-5 z-10 rounded-full border border-[#04E6A2]/30 bg-white/95 px-3 py-1.5 text-[11.5px] font-medium text-[#029F73] shadow-sm backdrop-blur"
              >
                {STEPS[step] || '시작'}
              </motion.div>
            </div>
          </div>
        </div>
      </ServiceMockShell>
    </div>
  );
}

function ServiceNode({ node }: { node: FlowNode }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.85, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={12}
        fill="#fff"
        stroke={node.selected ? '#04E6A2' : '#EAECEF'}
        strokeWidth={node.selected ? '2' : '1'}
      />
      {node.selected && (
        <rect
          x={node.x - 1}
          y={node.y - 1}
          width={NODE_W + 2}
          height={NODE_H + 2}
          rx={13}
          fill="none"
          stroke="rgba(4,230,162,0.25)"
          strokeWidth="3"
        />
      )}
      <text x={node.x + 16} y={node.y + 22} fontSize="11" fill="#A8ABB3" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        {node.index}
      </text>
      <text x={node.x + NODE_W - 16} y={node.y + 22} fontSize="11" fill="#A8ABB3" fontFamily="Pretendard Variable, Pretendard, sans-serif" textAnchor="end">
        2026.05.08
      </text>
      <text x={node.x + 16} y={node.y + 44} fontSize="14" fontWeight="600" fill="#171719" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        {node.title}
      </text>
      <rect x={node.x + 16} y={node.y + 56} width={36} height={18} rx={4} fill={node.variant === 'main' ? '#04E6A2' : '#F1F2F5'} />
      <text x={node.x + 34} y={node.y + 69} fontSize="10" fill={node.variant === 'main' ? '#062018' : '#4F525A'} textAnchor="middle" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        {node.variant === 'main' ? 'v2' : '기획'}
      </text>
      <rect x={node.x + 56} y={node.y + 56} width={36} height={18} rx={4} fill="rgba(4,230,162,0.18)" />
      <text x={node.x + 74} y={node.y + 69} fontSize="10" fill="#029F73" textAnchor="middle" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        외부연동
      </text>
      <text x={node.x + 102} y={node.y + 68} fontSize="10" fill="#A8ABB3" fontFamily="Pretendard Variable, Pretendard, sans-serif">
        +2
      </text>
      <circle cx={node.x + NODE_W - 24} cy={node.y + 64} r={9} fill="#FFD6CC" stroke="#fff" strokeWidth="2" />
    </motion.g>
  );
}

function Sidebar() {
  return (
    <aside className="flex h-full flex-col border-r border-[#EAECEF] bg-white px-3.5 py-5">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-[#04E6A2]">
          <span className="text-[14px] font-bold text-white">F</span>
        </div>
        <span className="truncate text-[13.5px] font-semibold text-[#171719]">플로밋 기획</span>
      </div>
      <ul className="flex flex-col gap-1 text-[13px] text-[#4F525A]">
        <li className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-[#F5F6F8]">
          <SearchSmall />
          <span>검색</span>
        </li>
        <li className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-[#F5F6F8]">
          <BellSmall />
          <span>수신함</span>
          <span className="ml-auto rounded-full bg-[#FF5757] px-1.5 py-0.5 text-[9px] font-semibold text-white">3</span>
        </li>
        <li className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-[#F5F6F8]">
          <SettingsSmall />
          <span>설정</span>
        </li>
      </ul>
    </aside>
  );
}

function Toolbar() {
  return (
    <div className="flex items-center justify-between border-b border-[#EAECEF] bg-white px-5 py-3">
      <div className="flex items-center gap-1 rounded-full border border-[#EAECEF] bg-[#F8F9FB] p-1 text-[12px]">
        <button className="rounded-full bg-[#171719] px-3 py-1 font-medium text-white">노드 플로우</button>
        <button className="rounded-full px-3 py-1 text-[#4F525A]">리스트</button>
        <button className="rounded-full px-3 py-1 text-[#4F525A]">칸반</button>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-6 w-6 rounded-full bg-[#FFD6CC]" />
        <span className="h-6 w-6 rounded-full bg-[#D6E5FF]" />
        <span className="h-6 w-6 rounded-full bg-[#E0D6FF]" />
      </div>
    </div>
  );
}

function ProjectLinks() {
  const items = [
    { name: 'Notion', color: '#000' },
    { name: 'Figma', color: '#F24E1E' },
    { name: 'Docs', color: '#4285F4' },
    { name: 'Vercel', color: '#000' },
  ];
  return (
    <div className="flex items-center gap-1.5 border-b border-[#EAECEF] bg-white px-5 py-2.5">
      {items.map((it) => (
        <span
          key={it.name}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#DDE0E6] bg-white px-2 py-0.5 text-[11px] text-[#4F525A]"
        >
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: it.color }} />
          {it.name}
        </span>
      ))}
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-dashed border-[#C7CAD0] text-[11px] text-[#A8ABB3]">+</span>
    </div>
  );
}

function FloatingActions({ step }: { step: number }) {
  const isMain = step === 1 || step === 2;
  const isSub = step === 3 || step === 4;
  return (
    <div className="absolute right-5 top-[68px] z-10 flex items-center gap-1.5 rounded-full border border-[#EAECEF] bg-white p-1 shadow-sm">
      <button className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] text-[#4F525A]">
        <span className="h-2.5 w-4 rounded-full bg-[#04E6A2]/30 ring-1 ring-[#04E6A2]/40" />
        점선 표시
      </button>
      <ActionBtn label="+ 메인 노드" highlight={isMain} primary />
      <ActionBtn label="+ 서브 노드" highlight={isSub} />
      <ActionBtn label="회의 추가" />
      <ActionBtn label="✦ AI 요약" />
    </div>
  );
}

function ActionBtn({ label, highlight, primary }: { label: string; highlight?: boolean; primary?: boolean }) {
  return (
    <motion.button
      animate={highlight ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, repeat: highlight ? Infinity : 0 }}
      className={[
        'rounded-full px-3 py-1.5 text-[11.5px] transition-all',
        primary && highlight
          ? 'bg-[#04E6A2] font-semibold text-white shadow-[0_0_16px_rgba(4,230,162,0.45)]'
          : primary
            ? 'bg-[#04E6A2] font-semibold text-white'
            : highlight
              ? 'bg-[#04E6A2]/15 font-medium text-[#029F73] ring-1 ring-[#04E6A2]/40'
              : 'text-[#4F525A]',
      ].join(' ')}
    >
      {label}
    </motion.button>
  );
}

function CursorPointer({ step }: { step: number }) {
  const positions: Record<number, { x: string; y: string }> = {
    1: { x: '78%', y: '6%' },
    2: { x: '78%', y: '6%' },
    3: { x: '85%', y: '6%' },
    4: { x: '85%', y: '6%' },
  };
  const pos = positions[step];
  if (!pos) return null;
  return (
    <motion.div
      key={`cursor-${step}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, left: pos.x, top: pos.y }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute z-20"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-2 animate-pulse-soft rounded-full bg-[#04E6A2]/40 blur-md" />
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <path d="M3 2.4 19 9.7l-7 1.8-2 7L3 2.4z" fill="#04E6A2" stroke="white" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  );
}

function CanvasGrid() {
  return (
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '14px 14px',
      }}
    />
  );
}

function ChatbotIcon() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="absolute bottom-5 right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A65] to-[#FF5722] shadow-lg shadow-orange-500/30"
    >
      <span className="text-[20px]">🤖</span>
    </motion.div>
  );
}

function UserBadge() {
  return (
    <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2.5">
      <span className="h-7 w-7 rounded-full bg-gradient-to-br from-[#FFB7A4] to-[#FF8866]" />
      <div className="text-[11px] leading-tight">
        <p className="font-medium text-[#171719]">황수민</p>
        <p className="text-[#7A8094]">thals655@kookmin.ac.kr</p>
      </div>
    </div>
  );
}

function SearchSmall() {
  return (
    <svg className="h-3.5 w-3.5 flex-none" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BellSmall() {
  return (
    <svg className="h-3.5 w-3.5 flex-none" viewBox="0 0 16 16" fill="none">
      <path d="M4 11V7.5a4 4 0 1 1 8 0V11l1 1.5H3L4 11z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SettingsSmall() {
  return (
    <svg className="h-3.5 w-3.5 flex-none" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.6 3.6l1 1M11.4 11.4l1 1M11.4 4.6l1-1M3.6 12.4l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
