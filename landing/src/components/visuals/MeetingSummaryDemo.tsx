'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ServiceMockShell } from './ServiceMockShell';

const SUMMARY = [
  { type: '결정', text: '회의 요약 정확도 개선을 v2 1순위로 채택' },
  { type: '결정', text: 'Meet 권한 범위 재설계 병행 진행' },
  { type: 'To-do', text: 'RAG 인덱싱 범위 확정 — 4월 22일까지' },
  { type: 'To-do', text: '출처 카드 UI 시안 공유 — 4월 27일까지' },
];

const STEP_LABELS = ['', '회의 생성하기 클릭', '회의 정보 입력', 'Google Meet 진행 중', 'AI 회의 요약 생성'];

// step: 0 = empty, 1 = modal opens, 2 = modal filled, 3 = Google Meet, 4 = summary
export function MeetingSummaryDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % 5);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={ref}>
      <ServiceMockShell url="flowmeet.kr / 노드 디테일" height={620}>
        <div className="absolute inset-0 grid grid-cols-[180px_minmax(0,1fr)_minmax(0,360px)]">
          {/* Sidebar */}
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

          {/* Canvas */}
          <div className="relative min-w-0 bg-[#FAFAFB]">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />
            <div className="relative flex flex-col gap-3 p-5">
              <div className="flex items-center gap-1 self-start rounded-full border border-[#EAECEF] bg-white p-1 text-[12px]">
                <button className="rounded-full bg-[#171719] px-3 py-1 font-medium text-white">노드 플로우</button>
                <button className="rounded-full px-3 py-1 text-[#4F525A]">리스트</button>
                <button className="rounded-full px-3 py-1 text-[#4F525A]">칸반</button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5 opacity-60">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <DimNode key={i} highlight={i === 1} />
                ))}
              </div>
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

            {/* Modal */}
            <AnimatePresence>
              {(step === 1 || step === 2) && (
                <CreateMeetingModal step={step} />
              )}
            </AnimatePresence>

            {/* Google Meet overlay */}
            <AnimatePresence>{step === 3 && <GoogleMeetOverlay />}</AnimatePresence>
          </div>

          {/* Right panel */}
          <aside className="relative flex h-full min-w-0 flex-col border-l border-[#EAECEF] bg-white">
            <span className="absolute left-0 top-1/2 h-12 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3490FF]" />
            <div className="flex items-center justify-between border-b border-[#EAECEF] px-5 py-3.5">
              <span className="font-medium text-[10.5px] tracking-[0.05em] text-[#A8ABB3]">#1.2</span>
              <span className="flex -space-x-1">
                <span className="h-5 w-5 rounded-full border-2 border-white bg-[#FFD6CC]" />
                <span className="h-5 w-5 rounded-full border-2 border-white bg-[#D6E5FF]" />
              </span>
            </div>

            <div className="px-5 pt-4">
              <h4 className="text-[17px] font-semibold text-[#171719]">회의 요약 정확도 개선</h4>
              <dl className="mt-4 space-y-2.5 text-[12px]">
                <Row label="태그">
                  <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10.5px] text-rose-600">AI</span>
                  <span className="ml-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10.5px] text-amber-700">프롬프트</span>
                </Row>
                <Row label="담당자">
                  <Avatar name="박정은" />
                </Row>
                <Row label="진행 상태">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-medium text-[#4F525A]">
                    ⋯ 진행 전
                  </span>
                </Row>
              </dl>
            </div>

            <div className="mt-4 grid grid-cols-2 border-y border-[#EAECEF] text-center text-[13px]">
              <button className="border-b border-transparent py-2.5 text-[#A8ABB3]">노트</button>
              <button className="border-b-2 border-[#171719] py-2.5 font-semibold text-[#171719]">회의</button>
            </div>

            {/* Right panel content varies by step */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {step <= 1 && <EmptyMeetingState key="empty" highlight={step === 1} />}
                {step === 2 && <SchedulingState key="scheduling" />}
                {step === 3 && <LiveMeetingState key="live" />}
                {step === 4 && <SummaryState key="summary" />}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </ServiceMockShell>
    </div>
  );
}

function EmptyMeetingState({ highlight }: { highlight: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center gap-3 px-5 py-8"
    >
      <FolderIcon />
      <p className="text-[12.5px] font-medium text-[#171719]">진행 중인 회의가 없어요</p>
      <p className="text-center text-[11px] text-[#7A8094]">
        아래 버튼을 클릭해서 새로운 회의를
        <br />
        생성해 주세요.
      </p>
      <motion.button
        animate={highlight ? { scale: [1, 1.06, 1], boxShadow: ['0 0 0 rgba(4,230,162,0)', '0 0 24px rgba(4,230,162,0.55)', '0 0 0 rgba(4,230,162,0)'] } : { scale: 1 }}
        transition={{ duration: 1.2, repeat: highlight ? Infinity : 0 }}
        className="mt-2 rounded-full bg-[#04E6A2] px-5 py-2 text-[12.5px] font-semibold text-white"
      >
        회의 생성하기
      </motion.button>
    </motion.div>
  );
}

function SchedulingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center gap-3 px-5 py-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="h-9 w-9 rounded-full border-2 border-[#04E6A2] border-r-transparent"
      />
      <p className="text-[11.5px] text-[#7A8094]">회의 정보 입력 중…</p>
    </motion.div>
  );
}

function LiveMeetingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col gap-3 px-5 py-5"
    >
      <div className="rounded-xl border border-[#EAECEF] bg-[#F8F9FB] p-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#00832D]/10 px-2 py-0.5 text-[10.5px] font-medium text-[#00832D]">
            <GoogleMeetIcon /> Google Meet
          </span>
          <span className="font-medium text-[10.5px] text-[#FF5757]">● LIVE</span>
        </div>
        <p className="mt-2 text-[12px] font-semibold text-[#171719]">회의 요약 정확도 개선</p>
        <p className="text-[10.5px] text-[#7A8094]">참여자 박정은 · 황수민 · 윤성욱 외 1명</p>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="font-medium text-[11px] text-[#4F525A]">12:34</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#EAECEF]">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1.6 }}
              className="block h-full bg-[#FF5757]"
            />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-[#04E6A2]/40 bg-[#F0FFFB] p-3">
        <div className="flex items-center gap-2 text-[11px] text-[#029F73]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#04E6A2] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#04E6A2]" />
          </span>
          AI가 회의를 실시간으로 정리하는 중<span className="animate-caret ml-0.5 text-[#04E6A2]">▍</span>
        </div>
      </div>
    </motion.div>
  );
}

function SummaryState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col gap-2 px-5 py-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-semibold text-[#171719]">AI 회의 요약</p>
        <span className="rounded-full bg-[#04E6A2]/15 px-2 py-0.5 text-[9.5px] font-medium text-[#029F73]">
          이 노드에 자동 첨부
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {SUMMARY.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
            className="flex items-start gap-2 rounded-lg border border-[#EAECEF] bg-white px-2.5 py-1.5"
          >
            <span
              className={[
                'mt-0.5 inline-flex flex-none items-center justify-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase',
                s.type === '결정' ? 'bg-[#04E6A2]/15 text-[#029F73]' : 'bg-amber-100 text-amber-700',
              ].join(' ')}
            >
              {s.type}
            </span>
            <span className="text-[11px] leading-[1.55] text-[#171719]">{s.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CreateMeetingModal({ step }: { step: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-20 flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h5 className="text-[15px] font-semibold text-[#171719]">회의 생성</h5>
          <span className="text-[#A8ABB3]">×</span>
        </div>
        <div className="mt-4 flex flex-col gap-3.5">
          <Field label="회의를 진행할 노드">
            <div className="flex items-center gap-2 rounded-lg border border-[#EAECEF] bg-[#FAFAFB] px-3 py-2.5">
              <span className="rounded bg-[#04E6A2]/15 px-1.5 py-0.5 text-[9.5px] text-[#029F73]">#1.2</span>
              <span className="text-[11.5px] text-[#171719]">회의 요약 정확도 개선</span>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="날짜">
              <FilledInput value={step === 2 ? '2026.04.03' : '날짜 선택'} icon={<CalendarIcon />} filled={step === 2} />
            </Field>
            <Field label="시간">
              <FilledInput value={step === 2 ? '15:30' : '시간 선택'} icon={<ClockIcon />} filled={step === 2} />
            </Field>
          </div>
          <Field label="참여자">
            {step === 2 ? (
              <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#EAECEF] bg-white px-2 py-1.5">
                <ParticipantChip name="박정은" />
                <ParticipantChip name="황수민" />
                <ParticipantChip name="윤성욱" />
              </div>
            ) : (
              <div className="rounded-lg border border-[#EAECEF] bg-white px-3 py-2.5 text-[11.5px] text-[#A8ABB3]">참여자 선택 ▾</div>
            )}
          </Field>
          <label className="flex items-center gap-2 text-[11px] text-[#4F525A]">
            <span className={['flex h-3.5 w-3.5 items-center justify-center rounded border', step === 2 ? 'border-[#04E6A2] bg-[#04E6A2] text-white' : 'border-[#C7CAD0]'].join(' ')}>
              {step === 2 ? <CheckSmall /> : null}
            </span>
            참여자에게 회의 알림 보내기
          </label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button className="rounded-lg border border-[#EAECEF] py-2.5 text-[12.5px] text-[#4F525A]">취소</button>
            <motion.button
              animate={step === 2 ? { boxShadow: ['0 0 0 rgba(4,230,162,0)', '0 0 24px rgba(4,230,162,0.45)', '0 0 0 rgba(4,230,162,0)'] } : {}}
              transition={{ duration: 1.2, repeat: step === 2 ? Infinity : 0 }}
              className="rounded-lg bg-[#04E6A2] py-2.5 text-[12.5px] font-semibold text-white"
            >
              회의 생성
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GoogleMeetOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-[#202124]"
    >
      <div className="grid grid-cols-2 gap-2 p-4">
        {['박정은', '황수민', '윤성욱', '+1'].map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative flex h-20 w-32 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#3c4043] to-[#202124]"
          >
            <span className="text-[14px] font-semibold text-white">{n}</span>
            <span className="absolute bottom-1 left-2 inline-flex items-center gap-1 text-[9px] text-white/70">
              <span className="h-1 w-1 rounded-full bg-[#34A853]" />
              연결됨
            </span>
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
        <span className="inline-flex h-3 w-3 items-center justify-center rounded-sm bg-[#00832D] text-[7px] font-bold text-white">M</span>
        <span className="text-[10.5px] text-white">Google Meet</span>
        <span className="font-medium text-[10px] text-[#FF5757]">● 12:34</span>
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10.5px] font-medium text-[#4F525A]">{label}</p>
      {children}
    </div>
  );
}

function FilledInput({ value, icon, filled }: { value: string; icon: React.ReactNode; filled?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#EAECEF] bg-white px-2.5 py-2">
      <span className={['text-[11.5px]', filled ? 'text-[#171719]' : 'text-[#A8ABB3]'].join(' ')}>{value}</span>
      <span className="text-[#A8ABB3]">{icon}</span>
    </div>
  );
}

function ParticipantChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#F1F2F5] px-1.5 py-0.5 text-[10.5px] text-[#4F525A]">
      <span className="h-3 w-3 rounded-full bg-gradient-to-br from-[#FFB7A4] to-[#FF8866]" />
      {name}
    </span>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-[60px] flex-none text-[#7A8094]">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] text-[#4F525A]">
      <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-[#C7B8FF] to-[#9B7FFF]" />
      {name}
    </span>
  );
}

function DimNode({ highlight }: { highlight?: boolean }) {
  return (
    <div
      className={[
        'rounded-lg border bg-white px-2.5 py-2',
        highlight ? 'border-[#04E6A2] shadow-[0_0_18px_rgba(4,230,162,0.25)]' : 'border-[#EAECEF]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-[9.5px] text-[#A8ABB3]">#1.2</span>
        <span className="text-[9.5px] text-[#A8ABB3]">2026.05.07</span>
      </div>
      <p className="mt-1 truncate text-[11px] font-medium text-[#171719]">회의 요약 정확도 개선</p>
      <div className="mt-1.5 flex items-center gap-1">
        <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] text-rose-600">AI</span>
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] text-amber-700">프롬프트</span>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 6.5h11M5 2v3M11 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CheckSmall() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="none">
      <path d="m3 8 3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleMeetIcon() {
  return (
    <span className="inline-flex h-3 w-3 items-center justify-center rounded-sm bg-[#00832D] text-[8px] font-bold text-white">M</span>
  );
}

function FolderIcon() {
  return (
    <svg className="h-10 w-10 text-[#D8DBE0]" viewBox="0 0 40 40" fill="currentColor" aria-hidden>
      <path d="M5 12c0-1.1.9-2 2-2h7l3 3h16c1.1 0 2 .9 2 2v15c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V12z" />
    </svg>
  );
}
