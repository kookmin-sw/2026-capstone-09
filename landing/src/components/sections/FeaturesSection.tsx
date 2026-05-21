"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eyebrow } from "../ui/Eyebrow";
import { SectionHeader } from "../ui/SectionHeader";
import { FeatureVideoPlayer } from "../visuals/FeatureVideoPlayer";

interface Feature {
  id: string;
  eyebrow: string;
  title: string;
  description: ReactNode;
  bullets: string[];
  video: string;
}

const FEATURES: Feature[] = [
  {
    id: "node-flow",
    eyebrow: "Feature 01 · Node Flow",
    title: "노드로 흐름을 시각화",
    description: (
      <>
        메인 노드는 우측으로, 메인의 서브 노드는 아래로,
        <br />
        서브 노드의 서브 노드는 우측으로만 확장돼요.
        <br />
        형식을 제한해 학습 부담은 낮추고, 기획 흐름은 그대로 보여요.
      </>
    ),
    bullets: [
      "메인과 서브 노드 분기 구조",
      "점선으로 의미 기반 관계 표현",
      "리스트와 칸반 보기 즉시 전환",
    ],
    video: "/videos/feature-1-nodeflow.mp4",
  },
  {
    id: "meeting",
    eyebrow: "Feature 02 · Meeting Summary",
    title: "자동으로 회의 정리",
    description: (
      <>
        노드 안에서 회의를 만들면,
        <br />
        회의가 끝나는 순간 AI가 회의 내용을 자동으로 요약해줘요.
      </>
    ),
    bullets: [
      "노드와 묶인 회의 생성과 알림",
      "결정과 To-do 자동 분류 요약",
      "요약 카드는 해당 노드에 자동 첨부",
    ],
    video: "/videos/feature-2-meeting.mp4",
  },
  {
    id: "agent",
    eyebrow: "Feature 03 · AI Agent",
    title: "AI 에이전트",
    description: (
      <>
        프로젝트 노드와 회의록 전체를 컨텍스트로 답하는 에이전트예요.
        <br />
        @로 노드나 사용자를 참조하면, 답변 옆에 출처 노드가 함께 따라와요.
      </>
    ),
    bullets: [
      "@로 노드나 사용자 참조",
      "Mcp 기반 업무 자동화",
      "대화형 인터페이스",
    ],
    video: "/videos/feature-3-agent.mp4",
  },
];

export function FeaturesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = textRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(i);
        },
        { rootMargin: "-35% 0px -35% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section
      id="features"
      className="relative scroll-mt-24 overflow-x-clip border-t border-white/[0.04] bg-[#070809] py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary-50)]/30 to-transparent" />
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <SectionHeader
          eyebrow="Features"
          titleClassName="leading-[1.12]"
          title={
            <>
              세 가지 흐름,
              <br />
              <span className="text-gradient-primary">하나의 화면</span>에서
            </>
          }
        />

        {/* Mobile — stacked vertical */}
        <div className="mt-24 flex flex-col gap-32 lg:hidden">
          {FEATURES.map((f, i) => (
            <div key={f.id} className="flex flex-col gap-6">
              <Eyebrow>{f.eyebrow}</Eyebrow>
              <h3 className="text-balance text-[clamp(28px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.7] text-[var(--color-text-muted)]">
                {f.description}
              </p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
              >
                <FeatureVideoPlayer src={f.video} />
              </motion.div>
              <ul className="mt-2 flex flex-col gap-3">
                {f.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-[14.5px] text-[var(--color-text)]"
                  >
                    <span className="mt-1.5 inline-flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full bg-[var(--color-primary-50)]/15 text-[var(--color-primary-50)]">
                      <CheckSmall />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Desktop — sticky right visual + scrolling left text */}
        <div className="mt-20 hidden grid-cols-[0.85fr_1fr] gap-12 lg:grid">
          <div className="flex flex-col">
            {FEATURES.map((f, i) => (
              <div
                key={f.id}
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
              >
                <FeatureText feature={f} isLast={i === FEATURES.length - 1} />
              </div>
            ))}
          </div>
          <div>
            <div
              className="sticky top-0 flex h-screen items-center"
              style={{
                width: 'calc(100% + 40px + max(0px, (100vw - 1240px) / 2))',
                transform: 'translateX(-40px)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FeatureVideoPlayer src={FEATURES[activeIdx].video} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureText({
  feature,
  isLast,
}: {
  feature: Feature;
  isLast: boolean;
}) {
  return (
    <div
      className={[
        "relative flex min-h-screen items-center",
        isLast ? "" : "pb-28",
      ].join(" ")}
    >
      <div className="flex flex-col gap-6">
        <Eyebrow>{feature.eyebrow}</Eyebrow>
        <h3 className="text-balance text-[clamp(32px,3.6vw,48px)] font-semibold leading-[1.12] tracking-[-0.02em] text-white">
          {feature.title}
        </h3>
        <p className="text-[16px] leading-[1.75] text-[var(--color-text-muted)]">
          {feature.description}
        </p>
        <ul className="mt-2 flex flex-col gap-3">
          {feature.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 text-[14.5px] text-[var(--color-text)]"
            >
              <span className="mt-1.5 inline-flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full bg-[var(--color-primary-50)]/15 text-[var(--color-primary-50)]">
                <CheckSmall />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CheckSmall() {
  return (
    <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none" aria-hidden>
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
