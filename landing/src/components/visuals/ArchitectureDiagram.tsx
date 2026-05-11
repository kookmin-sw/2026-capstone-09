'use client';

import { motion } from 'framer-motion';

interface NodeBox {
  label: string;
  sub: string;
  variant: 'client' | 'service' | 'ai' | 'storage';
}

const TIERS: { tier: string; nodes: NodeBox[] }[] = [
  {
    tier: 'Client',
    nodes: [
      { label: 'Web Client', sub: 'Next.js · React 19', variant: 'client' },
      { label: 'Desktop App', sub: 'Electron', variant: 'client' },
    ],
  },
  {
    tier: 'Gateway',
    nodes: [
      { label: 'API Gateway', sub: 'Spring Boot · REST', variant: 'service' },
      { label: 'WSS Server', sub: 'Yjs Sync · WebSocket', variant: 'service' },
    ],
  },
  {
    tier: 'Service',
    nodes: [
      { label: 'Core', sub: '프로젝트 · 노드 · 회의', variant: 'service' },
      { label: 'AI', sub: 'RAG · MCP · LLM', variant: 'ai' },
      { label: 'Doc Sync', sub: 'CRDT 영속화', variant: 'service' },
    ],
  },
  {
    tier: 'Storage',
    nodes: [
      { label: 'PostgreSQL', sub: 'Metadata', variant: 'storage' },
      { label: 'Vector DB', sub: 'Embeddings', variant: 'storage' },
      { label: 'Object Storage', sub: 'S3 · CDN', variant: 'storage' },
    ],
  },
];

const VARIANTS: Record<NodeBox['variant'], { bg: string; border: string; accent: string; tag: string }> = {
  client: { bg: 'rgba(123,211,255,0.08)', border: 'rgba(123,211,255,0.32)', accent: '#7BD3FF', tag: 'CLIENT' },
  service: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)', accent: '#ffffff', tag: 'SVC' },
  ai: { bg: 'rgba(4,230,162,0.10)', border: 'rgba(4,230,162,0.40)', accent: '#04e6a2', tag: 'AI' },
  storage: { bg: 'rgba(199,184,255,0.08)', border: 'rgba(199,184,255,0.32)', accent: '#C7B8FF', tag: 'STORE' },
};

export function ArchitectureDiagram() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0d12]">
      <DiagramHeader title="System Architecture" subtitle="flowMeet 4-Tier 구성" />

      <div className="relative px-6 py-8 lg:px-10 lg:py-10">
        <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-25" />
        <div className="pointer-events-none absolute -top-12 left-1/2 h-[200px] w-[60%] -translate-x-1/2 rounded-full bg-[var(--color-primary-50)]/[0.08] blur-[100px]" />

        <div className="relative flex flex-col gap-5">
          {TIERS.map((tier, ti) => (
            <Tier key={tier.tier} tier={tier} index={ti} isLast={ti === TIERS.length - 1} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] px-5 py-3 text-[11.5px] text-[var(--color-text-dim)]">
        {(Object.keys(VARIANTS) as NodeBox['variant'][]).map((v) => (
          <span key={v} className="flex items-center gap-1.5">
            <span className="block h-2 w-2 rounded-sm" style={{ background: VARIANTS[v].accent }} />
            {VARIANTS[v].tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Tier({
  tier,
  index,
  isLast,
}: {
  tier: { tier: string; nodes: NodeBox[] };
  index: number;
  isLast: boolean;
}) {
  return (
    <div className="relative">
      <div className="grid grid-cols-[80px_1fr] items-stretch gap-4">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="flex flex-col items-start gap-1.5 self-center"
        >
          <span className="font-medium text-[10px] tracking-[0.2em] text-[var(--color-text-faint)]">
            T{String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[12.5px] font-semibold text-white">{tier.tier}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: index * 0.08 + 0.05 }}
          className="grid auto-rows-fr gap-3"
          style={{ gridTemplateColumns: `repeat(${tier.nodes.length}, minmax(0, 1fr))` }}
        >
          {tier.nodes.map((n, i) => (
            <NodeCard key={n.label} node={n} delay={index * 0.08 + i * 0.05} />
          ))}
        </motion.div>
      </div>

      {!isLast && (
        <div className="ml-[96px] mt-3 flex items-center gap-2">
          <DownArrow />
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
            ↓ data flow
          </span>
        </div>
      )}
    </div>
  );
}

function NodeCard({ node, delay }: { node: NodeBox; delay: number }) {
  const v = VARIANTS[node.variant];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{ background: v.bg, borderColor: v.border }}
      className="relative flex items-center gap-3 rounded-xl border px-4 py-3.5 backdrop-blur"
    >
      <span className="block h-2 w-2 flex-none rounded-full" style={{ background: v.accent }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-white">{node.label}</p>
        <p className="truncate text-[11px] text-[var(--color-text-muted)]">{node.sub}</p>
      </div>
      <span
        className="font-medium text-[9.5px] tracking-[0.18em]"
        style={{ color: v.accent }}
      >
        {v.tag}
      </span>
    </motion.div>
  );
}

function DownArrow() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
      <line x1="6" y1="0" x2="6" y2="14" stroke="rgba(4,230,162,0.45)" strokeWidth="1.4" strokeDasharray="2 3" />
      <path d="M2 13l4 5 4-5" stroke="#04e6a2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function DiagramHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary-50)]">{title}</p>
        <p className="mt-0.5 text-[14px] text-white">{subtitle}</p>
      </div>
      <span className="rounded-full border border-[var(--color-primary-50)]/30 bg-[var(--color-primary-50)]/[0.06] px-2.5 py-1 text-[10px] tracking-[0.15em] text-[var(--color-primary-50)]">
        4-TIER
      </span>
    </div>
  );
}
