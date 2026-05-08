'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Eyebrow } from '../ui/Eyebrow';
import { SectionHeader } from '../ui/SectionHeader';
import { AnimatedBar } from '../visuals/AnimatedBar';
import { CompetitorTable } from '../visuals/CompetitorTable';
import { PainPointCloud } from '../visuals/PainPointCloud';
import { PersonaJourney } from '../visuals/PersonaJourney';
import { ProblemSolutionFlow } from '../visuals/ProblemSolutionFlow';
import { RespondentChart } from '../visuals/RespondentChart';
import { StatDonut } from '../visuals/StatDonut';

interface PainItem {
  title: string;
  description: ReactNode;
}

const PAIN_CARDS: PainItem[] = [
  {
    title: '정보 분산',
    description: '아이디어가 메신저, 문서, 회의록에 흩어져 매번 최신 버전을 확인해야 해요.',
  },
  {
    title: '구조 비가시성',
    description: '텍스트 중심 도구로는 분기와 확장이 한눈에 보이지 않아요.',
  },
  {
    title: '이해도 불균형',
    description: '같은 맥락을 회의마다 다시 설명하게 되고, 새 팀원은 따라잡기 어려워요.',
  },
];

interface DiffItem {
  label: string;
  title: string;
  description: ReactNode;
}

const DIFFERENTIATORS: DiffItem[] = [
  {
    label: '시각화',
    title: '노드 기반 분기 구조',
    description: (
      <>
        메인은 아래로, 서브는 우측으로.
        <br />
        흐름이 그대로 보여요.
      </>
    ),
  },
  {
    label: '회의',
    title: '노드와 묶인 회의',
    description: (
      <>
        회의를 노드 안에서 만들면,
        <br />
        회의록이 그대로 노드의 맥락이 돼요.
      </>
    ),
  },
  {
    label: 'AI Agent',
    title: '맥락을 아는 에이전트',
    description: (
      <>
        @로 노드나 사용자를 참조하면,
        <br />
        프로젝트 전체 맥락 안에서 답해줘요.
      </>
    ),
  },
];

export function IntroSection() {
  return (
    <section id="intro" className="relative scroll-mt-24 py-40">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <SectionHeader
          eyebrow="Introduction"
          titleClassName="leading-[1.12]"
          title={
            <span className="text-gradient-soft">기획을 흐름으로 보여줘요</span>
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24"
        >
          <PersonaJourney />
        </motion.div>

        {/* PAIN POINT — title left + (cloud + numbered list) right */}
        <div className="mt-40 grid gap-12 lg:grid-cols-[0.85fr_1.5fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SubHeader
              eyebrow="Pain Point"
              title={
                <>
                  프로젝트 중
                  <br />
                  이런 경험,
                  <br />
                  <span className="block md:w-max md:max-w-none md:text-nowrap">있지 않으셨나요?</span>
                </>
              }
            />
          </div>
          <div className="flex flex-col gap-12">
            <PainPointCloud />
            <div className="divide-y divide-white/[0.08]">
              {PAIN_CARDS.map((p, i) => (
                <PainRow key={p.title} pain={p} index={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-40">
          <SubHeader eyebrow="Survey" title="실제 사용자에게 직접 물어봤어요" />

          <div className="mt-16">
            <RespondentChart />
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-3">
            <SurveyColumn
              index={1}
              title="다시 확인할 때 가장 시간이 많이 걸리는 작업"
              bars={[
                { label: '논의 흐름을 이해하기 어려워요', value: 29.5, highlight: true },
                { label: '필요한 문서를 찾기 어려워요', value: 21.7 },
                { label: '이전 결정 이유를 이해해요', value: 10.9 },
                { label: '특별히 어려운 점은 없어요', value: 7.0 },
              ]}
            />
            <SurveyColumn
              index={2}
              title="아이디어 분기 관리가 어려운 이유"
              bars={[
                { label: '텍스트 중심이라 흐름이 잘 보이지 않아요', value: 50.4, highlight: true },
                { label: '히스토리 파악이 어려워요', value: 36.4 },
                { label: '문서가 길어 스크롤이 부담돼요', value: 22.5 },
                { label: '메신저에서 결정을 놓쳐요', value: 14.0 },
              ]}
            />
            <SurveyColumn
              index={3}
              title="정보가 흩어져서 생긴 문제"
              bars={[
                { label: '팀원 간 이해가 달라요', value: 46.5, highlight: true },
                { label: '맥락을 다시 설명해야 해요', value: 41.9 },
                { label: '최신 버전 찾기가 어려워요', value: 27.1 },
                { label: '문서를 찾지 못해요', value: 25.6 },
              ]}
            />
          </div>

          <div className="mt-24">
            <div className="mb-10 flex flex-col items-start gap-3">
              <Eyebrow>Expected Features</Eyebrow>
              <h4 className="text-balance text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
                솔루션 도입 시 기대되는 핵심 기능
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <StatDonut value={75.2} label="분기를 시각적으로 구현해요" size={260} />
              <StatDonut value={48.8} label="회의를 AI가 실시간으로 요약해요" size={260} />
              <StatDonut value={46.5} label="AI가 프로젝트 맥락을 이해해요" size={260} />
            </div>
          </div>
        </div>

        <div className="mt-40">
          <SubHeader eyebrow="Solution" title="이렇게 문제를 해결해요" />
          <div className="mt-16">
            <ProblemSolutionFlow />
          </div>
        </div>

        {/* DIFFERENTIATION — right title + left visual. R→L reading. */}
        <div className="mt-40 grid gap-12 lg:grid-cols-[1.3fr_0.85fr] lg:gap-16">
          <div className="lg:order-1">
            <CompetitorTable />
          </div>
          <div className="lg:order-2 lg:sticky lg:top-32 lg:self-start">
            <SubHeader
              eyebrow="Differentiation"
              title={
                <>
                  이런 점이
                  <br />
                  <span className="text-gradient-primary">달라요</span>
                </>
              }
            />
          </div>
        </div>

        {/* Differentiator: no boxes, hairline-divided columns */}
        <div className="mt-24 grid gap-x-10 gap-y-10 border-t border-white/[0.08] pt-12 lg:grid-cols-3">
          {DIFFERENTIATORS.map((d, i) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="flex flex-col gap-3 lg:border-l lg:border-white/[0.08] lg:pl-10 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-[var(--color-primary-50)]">
                {d.label}
              </span>
              <h3 className="text-[26px] font-semibold leading-[1.2] tracking-[-0.015em] text-white">
                {d.title}
              </h3>
              <p className="text-[15.5px] leading-[1.75] text-[var(--color-text-muted)]">
                {d.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h3 className="max-w-[940px] text-balance text-[clamp(30px,8vw,60px)] font-semibold leading-[1.12] tracking-[-0.02em] text-white">
        {title}
      </h3>
      {description && (
        <p className="max-w-[720px] text-[16px] leading-[1.75] text-[var(--color-text-muted)]">
          {description}
        </p>
      )}
    </div>
  );
}

function PainRow({ pain, index }: { pain: PainItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="grid items-start gap-6 py-10 first:pt-0 lg:grid-cols-[88px_1fr] lg:gap-10"
    >
      <span className="text-[clamp(48px,5vw,72px)] font-semibold leading-[1] tracking-[-0.03em] text-[var(--color-primary-50)]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex flex-col gap-3">
        <h4 className="text-[clamp(24px,2.8vw,34px)] font-semibold leading-[1.2] tracking-[-0.02em] text-white">
          {pain.title}
        </h4>
        <p className="text-[15.5px] leading-[1.75] text-[var(--color-text-muted)]">
          {pain.description}
        </p>
      </div>
    </motion.div>
  );
}

function SurveyColumn({
  index,
  title,
  bars,
}: {
  index: number;
  title: string;
  bars: { label: string; value: number; highlight?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-3">
        <span className="text-[12.5px] font-semibold tracking-[0.18em] text-[var(--color-primary-50)]">
          {String(index).padStart(2, '0')}
        </span>
        <span className="block h-px flex-1 bg-white/[0.08]" />
      </div>
      <h4 className="text-[18px] font-semibold leading-[1.4] text-white">{title}</h4>
      <div className="flex flex-col gap-5">
        {bars.map((b, i) => (
          <AnimatedBar
            key={b.label}
            label={b.label}
            value={b.value}
            highlight={b.highlight}
            delay={i * 0.12}
          />
        ))}
      </div>
    </div>
  );
}
