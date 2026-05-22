'use client';

import { motion } from 'framer-motion';
import { Eyebrow } from '../ui/Eyebrow';
import { SectionHeader } from '../ui/SectionHeader';
import { ArchitectureDiagram } from '../visuals/ArchitectureDiagram';
import { CRDTDiagram } from '../visuals/CRDTDiagram';
import { DocSkeleton } from '../visuals/DocSkeleton';
import { MCPDiagram } from '../visuals/MCPDiagram';
import { PPTCarousel } from '../visuals/PPTCarousel';
import { PosterCard } from '../visuals/PosterCard';

interface DocItem {
  id: string;
  eyebrow: string;
  title: string;
  image?: string;
}

const ITEMS: DocItem[] = [
  { id: 'arch', eyebrow: 'Doc 01', title: 'Architecture' },
  { id: 'mcp', eyebrow: 'Doc 02', title: 'MCP' },
  { id: 'crdt', eyebrow: 'Doc 03', title: 'CRDT' },
];

export function DocsSection() {
  return (
    <section id="docs" className="relative scroll-mt-24 border-t border-white/[0.04] py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary-50)]/30 to-transparent" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.16]" />
      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <SectionHeader
          eyebrow="Documentation"
          title={
            <span className="text-gradient-primary">기술 구조</span>
          }
        />

        <div className="mt-32 space-y-32">
          {ITEMS.map((item, i) => (
            <DocBlock item={item} index={i} key={item.id} />
          ))}
        </div>

        <div className="mt-40">
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow align="center">Resources</Eyebrow>
            <h3 className="text-balance text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              포스터 및 발표 자료
            </h3>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="mt-16 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
          >
            <div className="relative aspect-video w-full">
              <iframe
                src="https://www.youtube.com/embed/eSjDWheBlbU?rel=0"
                title="flowMeet 발표 영상"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </motion.div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <PosterCard />
            <PPTCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}

function DocVisual({ item }: { item: DocItem }) {
  if (item.id === 'arch') return <ArchitectureDiagram />;
  if (item.id === 'mcp') return <MCPDiagram />;
  if (item.id === 'crdt') return <CRDTDiagram />;
  if (item.image) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2">
        <img
          src={item.image}
          alt={`${item.title} diagram`}
          className="block h-auto w-full rounded-xl"
        />
      </div>
    );
  }
  return <DocSkeleton />;
}

function DocBlock({ item, index }: { item: DocItem; index: number }) {
  // Doc 01 (Architecture) — centered text + skeleton below (was special-cased earlier)
  if (index === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center gap-10 text-center lg:gap-14"
      >
        <div className="flex flex-col items-center gap-4">
          <Eyebrow align="center">{item.eyebrow}</Eyebrow>
          <h3 className="text-[clamp(48px,8vw,128px)] font-semibold leading-[1] tracking-[-0.03em] text-white">
            {item.title}
          </h3>
        </div>
        <div className="w-full max-w-[1100px]">
          <DocVisual item={item} />
        </div>
      </motion.div>
    );
  }

  // Doc 02 (MCP) — text RIGHT, image LEFT (alternating)
  // Doc 03 (CRDT) — text LEFT, image RIGHT (alternating)
  const reverse = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className={[
        'grid items-start gap-10 lg:-ml-12 lg:w-[calc(100%+96px)] lg:gap-12',
        reverse
          ? 'lg:grid-cols-[minmax(0,900px)_minmax(280px,1fr)]'
          : 'lg:grid-cols-[minmax(280px,1fr)_minmax(0,900px)]',
      ].join(' ')}
    >
      <div
        className={[
          'flex flex-col gap-4',
          reverse ? 'lg:order-2 lg:items-end lg:text-right' : '',
        ].join(' ')}
      >
        <Eyebrow>{item.eyebrow}</Eyebrow>
        <h3 className="text-[clamp(48px,7vw,104px)] font-semibold leading-[1] tracking-[-0.03em] text-white">
          {item.title}
        </h3>
      </div>
      <div className={['w-full max-w-[900px]', reverse ? 'lg:order-1' : ''].join(' ')}>
        <DocVisual item={item} />
      </div>
    </motion.div>
  );
}
