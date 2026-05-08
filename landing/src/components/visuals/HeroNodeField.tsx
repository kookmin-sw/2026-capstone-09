'use client';

import { motion } from 'framer-motion';

const ORBIT_TR = [
  { angle: 30, ringIdx: 0 },
  { angle: 70, ringIdx: 1 },
  { angle: 110, ringIdx: 2 },
  { angle: 150, ringIdx: 0 },
];
const ORBIT_BL = [
  { angle: -30, ringIdx: 0 },
  { angle: -75, ringIdx: 1 },
  { angle: -120, ringIdx: 2 },
];

export function HeroNodeField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle radial dot grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Background glows — stronger and more layered */}
      <div className="pointer-events-none absolute -left-32 -top-40 h-[620px] w-[620px] rounded-full bg-[var(--color-primary-50)]/[0.20] blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-[680px] w-[680px] rounded-full bg-[var(--color-primary-50)]/[0.16] blur-[150px]" />
      <div className="pointer-events-none absolute left-1/2 top-[30%] h-[460px] w-[920px] -translate-x-1/2 rounded-full bg-[var(--color-primary-50)]/[0.06] blur-[140px]" />

      {/* Soft horizontal scan glow */}
      <div className="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-[var(--color-primary-50)]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-[58%] h-px bg-gradient-to-r from-transparent via-[var(--color-primary-50)]/20 to-transparent" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="hero-orb-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#04e6a2" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#04e6a2" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#04e6a2" stopOpacity="0" />
            <stop offset="50%" stopColor="#04e6a2" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#04e6a2" stopOpacity="0" />
          </linearGradient>
          <filter id="hero-blur">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {/* Top-right radar */}
        <CornerRadar cx={1180} cy={120} reverse={false} orbits={ORBIT_TR} />

        {/* Bottom-left radar */}
        <CornerRadar cx={140} cy={620} reverse orbits={ORBIT_BL} />

        {/* Crossing diagonal lines (subtle) */}
        <line x1="0" y1="120" x2="1280" y2="600" stroke="url(#hero-line)" strokeWidth="0.7" strokeDasharray="2 8" opacity="0.7" />
        <line x1="0" y1="600" x2="1280" y2="120" stroke="url(#hero-line)" strokeWidth="0.7" strokeDasharray="2 8" opacity="0.5" />

        {/* Floating connection lines */}
        <DataConnection from={[1180, 120]} to={[640, 360]} delay={0.4} />
        <DataConnection from={[140, 620]} to={[640, 360]} delay={0.8} />
        <DataConnection from={[1180, 120]} to={[140, 620]} delay={1.2} dashed />

        {/* Center pulse rings (very soft, behind text) */}
        <CenterPulses />

        {/* Center small marker */}
        <motion.circle
          cx={640}
          cy={360}
          r="3"
          fill="#04e6a2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Center vignette to keep text crisp */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_55%_at_50%_50%,rgba(5,6,8,0.92),rgba(5,6,8,0.55)_50%,transparent_85%)]" />
      {/* Edge fade for section transition */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050608] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050608] to-transparent" />
    </div>
  );
}

function CornerRadar({ cx, cy, reverse, orbits }: { cx: number; cy: number; reverse: boolean; orbits: { angle: number; ringIdx: number }[] }) {
  const radii = [120, 200, 280, 360];
  return (
    <g>
      {/* Static dashed rings */}
      {radii.map((r, i) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(4,230,162,0.16)"
          strokeWidth="0.8"
          strokeDasharray={i % 2 === 0 ? '2 6' : '4 4'}
          opacity={0.5 + (1 - i / radii.length) * 0.4}
        />
      ))}
      {/* Rotating orbit dots */}
      <motion.g
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {orbits.map((n, i) => {
          const r = radii[n.ringIdx];
          const rad = (n.angle * Math.PI) / 180;
          const px = cx + Math.cos(rad) * r;
          const py = cy + Math.sin(rad) * r;
          return (
            <g key={i}>
              <circle cx={px} cy={py} r="3" fill="#04e6a2" opacity="0.9" />
              <circle cx={px} cy={py} r="6" fill="#04e6a2" opacity="0.18">
                <animate attributeName="r" values="6;9;6" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.18;0;0.18" dur="3s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </motion.g>
      {/* Bright marker at center of corner radar */}
      <circle cx={cx} cy={cy} r="2" fill="#04e6a2" />
      <circle cx={cx} cy={cy} r="6" fill="rgba(4,230,162,0.4)">
        <animate attributeName="r" values="6;14;6" dur="3.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="3.4s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function CenterPulses() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={640}
          cy={360}
          r="60"
          fill="none"
          stroke="rgba(4,230,162,0.5)"
          strokeWidth="0.7"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 5], opacity: [0.5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, delay: i * 1.8, ease: 'easeOut' }}
          style={{ transformOrigin: '640px 360px' }}
        />
      ))}
    </g>
  );
}

function DataConnection({
  from,
  to,
  delay,
  dashed,
}: {
  from: [number, number];
  to: [number, number];
  delay: number;
  dashed?: boolean;
}) {
  const path = `M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`;
  return (
    <g>
      <motion.path
        d={path}
        stroke={dashed ? 'rgba(4,230,162,0.18)' : 'url(#hero-line)'}
        strokeWidth="0.8"
        strokeDasharray={dashed ? '3 6' : undefined}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay, ease: 'easeOut' }}
      />
      {!dashed && (
        <motion.circle r="2.4" fill="#04e6a2">
          <animateMotion dur="6s" repeatCount="indefinite" path={path} />
          <animate attributeName="opacity" values="0;1;0" dur="6s" repeatCount="indefinite" />
        </motion.circle>
      )}
    </g>
  );
}
