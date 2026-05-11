'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionHeader } from '../ui/SectionHeader';

interface Member {
  name: string;
  role: string;
  area: string;
  email: string;
  photo: string;
  initials: string;
  accent: string;
  isLead?: boolean;
}

const TEAM: Member[] = [
  {
    name: '황수민',
    role: 'Team Lead · Backend',
    area: '서비스 백본 · 회의 / Meet 연동',
    email: 'thals655@kookmin.ac.kr',
    photo: '/team/hwangsumin.jpg',
    initials: 'HSM',
    accent: 'from-[#04e6a2]/35 to-[#04e6a2]/5',
    isLead: true,
  },
  {
    name: '윤성욱',
    role: 'Backend',
    area: 'CRDT · 실시간 동기화',
    email: 'seonguk3553@kookmin.ac.kr',
    photo: '/team/yunseonguk.jpg',
    initials: 'YSU',
    accent: 'from-[#04e6a2]/35 to-[#04e6a2]/5',
  },
  {
    name: '박정은',
    role: 'AI',
    area: '에이전트 · RAG · MCP',
    email: 'ovepje2004@gmail.com',
    photo: '/team/parkjeongeun.jpg',
    initials: 'PJE',
    accent: 'from-[#FF8FA3]/35 to-[#FF8FA3]/5',
  },
  {
    name: '박건민',
    role: 'Frontend',
    area: '노드 플로우 · 노드 디테일',
    email: 'pkm021118@kookmin.ac.kr',
    photo: '/team/parkgunmin.jpg',
    initials: 'PGM',
    accent: 'from-[#7BD3FF]/35 to-[#7BD3FF]/5',
  },
  {
    name: '백채린',
    role: 'Frontend',
    area: '랜딩 · 디자인 시스템',
    email: 'cofls00@kookmin.ac.kr',
    photo: '/team/baekchaerin.jpg',
    initials: 'BCR',
    accent: 'from-[#FFB78A]/35 to-[#FFB78A]/5',
  },
  {
    name: '윤신지',
    role: 'Frontend',
    area: '실시간 협업 · 회의 UI',
    email: 'sinji1012@kookmin.ac.kr',
    photo: '/team/yunsinji.jpg',
    initials: 'YSJ',
    accent: 'from-[#C7B8FF]/35 to-[#C7B8FF]/5',
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent"
        >
          <div className="relative h-[360px] w-full overflow-hidden">
            <img
              src="/team/group.jpg"
              alt="flowMeet 팀 단체사진"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <TeamBackdropFallback />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
            <div className="absolute inset-0 flex items-end justify-between gap-6 p-8 lg:p-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-primary-50)]">
                  Team Photo
                </p>
                <p className="mt-2 max-w-[460px] text-[15px] leading-[1.7] text-white">
                  6명이 모여 노드라는 단위로 팀 협업의 흐름을 새로 짜고 있어요.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          src={member.photo}
          alt={member.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-medium text-[36px] font-semibold tracking-[0.05em] text-white/30">
            {member.initials}
          </span>
        </div>
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
          className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-primary-50)]"
        >
          <MailIcon />
          {member.email}
        </a>
      </div>
    </motion.article>
  );
}

function TeamBackdropFallback() {
  return (
    <div className="absolute inset-0">
      <div className="bg-grid-fine absolute inset-0 opacity-30" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1100 360"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="team-orb-1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#04e6a2" stopOpacity="0.50" />
            <stop offset="100%" stopColor="#04e6a2" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="team-orb-2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7BD3FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7BD3FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="180" r="280" fill="url(#team-orb-1)" />
        <circle cx="900" cy="140" r="320" fill="url(#team-orb-2)" />
      </svg>
    </div>
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
