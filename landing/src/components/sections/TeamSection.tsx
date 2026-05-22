'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { asset } from '@/lib/asset';
import { SectionHeader } from '../ui/SectionHeader';

interface Member {
  name: string;
  role: string;
  area: string;
  email: string;
  github: string;
  photo: string;
  initials: string;
  accent: string;
  isLead?: boolean;
  photoPosition?: string;
}

const TEAM: Member[] = [
  {
    name: '황수민',
    role: 'Team Lead · Backend',
    area: '아키텍처 설계 · CI/CD 파이프라인 · API 구현 · MCP 서버',
    email: 'thals655@kookmin.ac.kr',
    github: 'https://github.com/tnals0924',
    photo: '/team/hwangsumin.jpg',
    initials: 'HSM',
    accent: 'from-[#04e6a2]/35 to-[#04e6a2]/5',
    isLead: true,
  },
  {
    name: '윤성욱',
    role: 'Backend',
    area: 'SQS 비동기 파이프라인 · MCP 서버 · SSE 알림',
    email: 'seonguk3553@kookmin.ac.kr',
    github: 'https://github.com/wngktjd13',
    photo: '/team/yunseonguk.jpg',
    initials: 'YSU',
    accent: 'from-[#04e6a2]/35 to-[#04e6a2]/5',
  },
  {
    name: '박정은',
    role: 'AI',
    area: '에이전트 · LLM · MCP',
    email: 'ovepje2004@kookmin.ac.kr',
    github: 'https://github.com/ovepje2004',
    photo: '/team/parkjeongeun.jpg',
    initials: 'PJE',
    accent: 'from-[#FF8FA3]/35 to-[#FF8FA3]/5',
  },
  {
    name: '박건민',
    role: 'Frontend',
    area: '디자인 · 랜딩페이지 · 모달 · 사이드바 · 헤더',
    email: 'pkm021118@kookmin.ac.kr',
    github: 'https://github.com/pkm021118',
    photo: '/team/parkgunmin.jpg',
    initials: 'PGM',
    accent: 'from-[#7BD3FF]/35 to-[#7BD3FF]/5',
  },
  {
    name: '윤신지',
    role: 'Frontend',
    area: '동시성 처리(CRDT) · Chrome Extension',
    email: 'sinji1012@kookmin.ac.kr',
    github: 'https://github.com/sinji2102',
    photo: '/team/yunsinji.jpg',
    initials: 'YSJ',
    accent: 'from-[#C7B8FF]/35 to-[#C7B8FF]/5',
  },
  {
    name: '백채린',
    role: 'Frontend',
    area: '로그인/회원가입 · 노드 플로우 · AI 채팅 플로팅',
    email: 'cofls00@kookmin.ac.kr',
    github: 'https://github.com/chael-in',
    photo: '/team/baekchaerin.jpg',
    initials: 'BCR',
    accent: 'from-[#FFB78A]/35 to-[#FFB78A]/5',
    photoPosition: '50% 65%',
  },
];

export function TeamSection() {
  return (
    <section
      id="team"
      className="relative scroll-mt-24 border-t border-white/[0.04] bg-[#070809] py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary-50)]/40 to-transparent" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.16]" />
      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <SectionHeader
          eyebrow="Team"
          title={<><span className="text-gradient-primary">흐름</span>을 만드는 사람들</>}
          description="국민대학교 2026 캡스톤디자인 Team 09"
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <MemberCard key={m.name} member={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, (v) => v * 5);
  const rotateX = useTransform(sy, (v) => v * -5);

  function handleMouse(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] transition-colors hover:border-[var(--color-primary-50)]/35 hover:bg-white/[0.06]"
    >
      <div className={`relative aspect-[4/3] w-full bg-gradient-to-br ${member.accent}`}>
        <img
          src={asset(member.photo)}
          alt={member.name}
          className="absolute inset-0 h-full w-full object-cover"
          style={member.photoPosition ? { objectPosition: member.photoPosition } : undefined}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        {member.isLead && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[var(--color-primary-50)]/45 bg-black/60 px-2 py-0.5 text-[10.5px] font-medium text-[var(--color-primary-50)] backdrop-blur">
            ★ Team Lead
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="relative flex flex-col gap-2 p-6">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-[18px] font-semibold text-white">{member.name}</h4>
          <span className="text-[11.5px] text-[var(--color-primary-50)]">{member.role}</span>
        </div>
        <p className="text-[13px] leading-[1.55] text-[var(--color-text-muted)]">{member.area}</p>
        <a
          href={`mailto:${member.email}`}
          className="relative z-20 mt-1 inline-flex w-fit items-center gap-1.5 text-[12px] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-primary-50)]"
        >
          <MailIcon />
          {member.email}
        </a>
      </div>

      <a
        href={member.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${member.name}의 GitHub 프로필 열기`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-50)]/60"
      />
      <span className="pointer-events-none absolute right-3 top-3 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.12] bg-black/55 text-white/70 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
        <GithubIcon />
      </span>
    </motion.article>
  );
}

function GithubIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="m3 5 5 4 5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
