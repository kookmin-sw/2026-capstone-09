'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ServiceMockShell } from './ServiceMockShell';

const STEP_LABELS = [
  '',
  '챗봇 플로팅 버튼 클릭',
  '@ 옵션 메뉴 열림',
  '노드 선택 → 입력창에 추가',
  '질문 입력 후 전송',
  'AI 답변 + 출처 노드',
];

const ANSWER = {
  title: 'AI 어시스턴트 — 진행 정리',
  bullets: [
    'RAG 인덱싱 범위 확정 — 4/22까지 진행 중',
    '참조 노드 신뢰도 스코어링 — 실험 단계',
    '출처 카드 UI 설계 — UX 디자인 검토 중',
  ],
  refs: ['#2', '#2.1', '#2.2', '#2.1.1'],
};

export function AgentDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % 6);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const showFAB = step === 0 || step === 1;
  const showMenu = step === 1;
  const showChatPanel = step >= 2;

  return (
    <div ref={ref}>
      <ServiceMockShell url="flowmeet.kr / AI 에이전트" height={620}>
        <div className="absolute inset-0 grid grid-cols-[180px_1fr]">
          <Sidebar />

          <div className="relative min-w-0 bg-[#FAFAFB]">
            <Toolbar />
            <ProjectLinks />

            <div className="relative flex-1 overflow-hidden">
              <CanvasGrid />

              <div className="relative grid grid-cols-2 gap-2.5 p-5 opacity-65">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <DimNode key={i} />
                ))}
              </div>

              {/* Step indicator */}
              <motion.div
                key={step}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-5 top-5 z-30 rounded-full border border-[#04E6A2]/30 bg-white/95 px-3 py-1.5 text-[11.5px] font-medium text-[#029F73] shadow-sm backdrop-blur"
              >
                {STEP_LABELS[step] || '대기 중'}
              </motion.div>

              {/* Floating chatbot button */}
              <AnimatePresence>
                {showFAB && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#04E6A2] to-[#029F73] shadow-lg shadow-[#04E6A2]/40"
                  >
                    <SparkleIcon className="h-5 w-5" />
                    {step === 1 && (
                      <motion.span
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="absolute inset-0 rounded-full ring-2 ring-[#04E6A2]"
                      />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Cursor pointing at FAB */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  className="pointer-events-none absolute bottom-[44px] right-[44px] z-30"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M3 2.4 19 9.7l-7 1.8-2 7L3 2.4z" fill="#04E6A2" stroke="white" strokeWidth="1" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}

              {/* Inline mini menu (on top of floating button) */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-[80px] right-5 z-20 w-[260px] rounded-xl border border-[#EAECEF] bg-white p-2 shadow-lg"
                  >
                    <p className="px-2 py-1 text-[10.5px] uppercase tracking-[0.15em] text-[#A8ABB3]">참조 종류 선택</p>
                    <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 hover:bg-[#F5F6F8]">
                      <span className="flex items-center gap-2 text-[12.5px] text-[#171719]">
                        <UserIcon /> 사용자
                      </span>
                      <span className="text-[#A8ABB3]">›</span>
                    </button>
                    <button className="flex w-full items-center justify-between rounded-lg bg-[#04E6A2]/10 px-2 py-2">
                      <span className="flex items-center gap-2 text-[12.5px] font-medium text-[#029F73]">
                        <NodeIcon /> 노드
                      </span>
                      <span className="text-[#029F73]">›</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full chat panel slides in from right */}
              <AnimatePresence>
                {showChatPanel && (
                  <motion.aside
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-5 right-5 top-[80px] z-20 flex w-[300px] flex-col overflow-hidden rounded-2xl border border-[#EAECEF] bg-white shadow-2xl"
                  >
                    <ChatHeader />
                    <ChatBody step={step} />
                    <ChatInput step={step} />
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>

            <UserBadge />
          </div>
        </div>
      </ServiceMockShell>
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="flex items-center justify-between border-b border-[#EAECEF] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#04E6A2]/15">
          <SparkleIcon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-semibold text-[#171719]">플로밋 AI 에이전트</p>
          <p className="truncate text-[10px] text-[#7A8094]">새 대화를 시작하세요</p>
        </div>
      </div>
      <span className="text-[#A8ABB3]">⋯</span>
    </div>
  );
}

function ChatBody({ step }: { step: number }) {
  return (
    <div className="relative flex-1 overflow-hidden px-3 py-3">
      <AnimatePresence mode="wait">
        {step === 2 && <NodeListView key="list" />}
        {step >= 3 && <ConversationView key="conv" step={step} />}
      </AnimatePresence>
    </div>
  );
}

function NodeListView() {
  const NODES = [
    { idx: '#1', title: '회의 기능 전면 개편' },
    { idx: '#1.1', title: 'Google Meet 연동 강화' },
    { idx: '#1.2', title: '회의 요약 정확도 개선' },
    { idx: '#2', title: 'AI 어시스턴트 고도화' },
    { idx: '#2.1', title: 'AI 답변 출처 표시' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col gap-1"
    >
      <p className="mb-1 px-1 text-[10.5px] uppercase tracking-[0.15em] text-[#A8ABB3]">노드 검색 / 선택</p>
      <div className="rounded-lg border border-[#EAECEF] bg-[#FAFAFB] px-2 py-1.5">
        <span className="text-[11px] text-[#A8ABB3]">검색…</span>
      </div>
      <ul className="mt-1 flex flex-1 flex-col gap-0.5 overflow-hidden">
        {NODES.map((n, i) => (
          <motion.li
            key={n.idx}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
            className={[
              'flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]',
              i === 4 ? 'bg-[#04E6A2]/10' : 'hover:bg-[#F5F6F8]',
            ].join(' ')}
          >
            <span className={['rounded text-[9.5px]', i === 4 ? 'bg-white text-[#029F73]' : 'text-[#A8ABB3]'].join(' ')}>
              {n.idx}
            </span>
            <span className={i === 4 ? 'font-medium text-[#171719]' : 'text-[#4F525A]'}>{n.title}</span>
            {i === 4 && <span className="ml-auto text-[#029F73]">✓</span>}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function ConversationView({ step }: { step: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col gap-3"
    >
      {/* User message */}
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[220px] rounded-2xl rounded-tr-md bg-[#F1F2F5] px-3 py-2 text-[11.5px] leading-[1.55] text-[#171719]"
        >
          <span className="rounded-md bg-[#04E6A2]/15 px-1 py-0.5 font-medium text-[#029F73]">@AI 답변 출처 표시</span>{' '}
          노드 진행 정리해줘.
        </motion.div>
      </div>

      {/* AI response */}
      {step === 4 ? (
        <ThinkingView />
      ) : step >= 5 ? (
        <AgentAnswer />
      ) : null}
    </motion.div>
  );
}

function ThinkingView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start gap-2"
    >
      <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#04E6A2]/15">
        <span className="block h-1.5 w-1.5 rounded-full bg-[#04E6A2]" />
      </span>
      <div className="rounded-2xl rounded-tl-md border border-[#EAECEF] bg-white px-3 py-2 text-[11px] text-[#7A8094]">
        <span className="inline-flex items-center gap-1.5">
          <ThinkingDots /> 컨텍스트 구성 중
        </span>
      </div>
    </motion.div>
  );
}

function AgentAnswer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-start gap-2"
    >
      <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#04E6A2]/15">
        <span className="block h-1.5 w-1.5 rounded-full bg-[#04E6A2]" />
      </span>
      <div className="max-w-[220px] flex-1 space-y-2 rounded-2xl rounded-tl-md border border-[#EAECEF] bg-white px-3 py-2.5">
        <h5 className="text-[12px] font-semibold text-[#171719]">{ANSWER.title}</h5>
        <ul className="space-y-1">
          {ANSWER.bullets.map((b, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -2 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-1.5 text-[10.5px] leading-[1.55] text-[#4F525A]"
            >
              <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#04E6A2]" />
              <span>{b}</span>
            </motion.li>
          ))}
        </ul>
        <div>
          <p className="mb-1 text-[9px] uppercase tracking-[0.15em] text-[#A8ABB3]">참고 노드</p>
          <div className="flex flex-wrap gap-0.5">
            {ANSWER.refs.map((r, i) => (
              <motion.span
                key={r}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.45 + i * 0.05 }}
                className="cursor-pointer rounded-md border border-[#EAECEF] bg-white px-1.5 py-0.5 text-[10px] text-[#4F525A] hover:border-[#04E6A2] hover:text-[#029F73]"
              >
                {r}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChatInput({ step }: { step: number }) {
  const inputContent = step === 3 || step >= 4;
  return (
    <div className="border-t border-[#EAECEF] bg-white p-2.5">
      <div className="flex items-center gap-2 rounded-xl border border-[#EAECEF] bg-[#FAFAFB] px-2.5 py-1.5">
        {inputContent ? (
          <span className="flex flex-1 items-center gap-1 text-[11px] text-[#171719]">
            <span className="rounded-md bg-[#04E6A2]/15 px-1 py-0.5 font-medium text-[#029F73]">@AI 답변 출처 표시</span>
            {step >= 4 && <span className="truncate text-[#4F525A]">노드 진행 정리해줘.</span>}
            {step === 3 && <span className="ml-1 animate-caret text-[#04E6A2]">▍</span>}
          </span>
        ) : (
          <span className="flex-1 truncate text-[11px] text-[#A8ABB3]">@로 사용자·노드를 참조하세요</span>
        )}
        <button className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-[#04E6A2] text-white">
          <SendIcon />
        </button>
      </div>
    </div>
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
        <li className="rounded-lg px-2 py-2 hover:bg-[#F5F6F8]">검색</li>
        <li className="flex items-center rounded-lg px-2 py-2 hover:bg-[#F5F6F8]">
          수신함
          <span className="ml-auto rounded-full bg-[#FF5757] px-1.5 py-0.5 text-[9px] font-semibold text-white">3</span>
        </li>
        <li className="rounded-lg px-2 py-2 hover:bg-[#F5F6F8]">설정</li>
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
    </div>
  );
}

function CanvasGrid() {
  return (
    <div
      className="absolute inset-0 opacity-50"
      style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '14px 14px',
      }}
    />
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

function DimNode() {
  return (
    <div className="rounded-lg border border-[#EAECEF] bg-white px-2.5 py-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-[9.5px] text-[#A8ABB3]">#1</span>
        <span className="text-[9.5px] text-[#A8ABB3]">2026.05.07</span>
      </div>
      <p className="mt-1 truncate text-[11px] font-medium text-[#171719]">디자인 회의일걸요?</p>
      <div className="mt-1.5 flex items-center gap-1">
        <span className="rounded bg-[#F1F2F5] px-1.5 py-0.5 text-[9px] text-[#4F525A]">텍스트</span>
        <span className="rounded bg-[#04E6A2]/15 px-1.5 py-0.5 text-[9px] text-[#029F73]">텍스트</span>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
          className="h-1 w-1 rounded-full bg-[#04E6A2]"
        />
      ))}
    </span>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l1.8 4.6 4.7 1.8-4.7 1.8L12 16l-1.8-4.8L5.5 9.4l4.7-1.8L12 3z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-[#04E6A2]" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 13c1-2.5 3-4 5-4s4 1.5 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-[#04E6A2]" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="8" y="9" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 7v2h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
      <path d="M2 8h12M9 4l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
