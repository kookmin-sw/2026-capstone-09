'use client';

import { motion } from 'framer-motion';
import { Eyebrow } from '../ui/Eyebrow';
import { SectionHeader } from '../ui/SectionHeader';
import { DocSkeleton } from '../visuals/DocSkeleton';
import { PPTCarousel } from '../visuals/PPTCarousel';
import { PosterCard } from '../visuals/PosterCard';

const ITEMS = [
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
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <PosterCard />
            <PPTCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}

function DocBlock({ item, index }: { item: (typeof ITEMS)[number]; index: number }) {
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
        <div className="w-full max-w-[860px]">
          <DocSkeleton />
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
      {reverse ? (
        <>
          <div className="w-full max-w-[900px]">
            <DocSkeleton />
          </div>
          <div className="flex flex-col items-end gap-4 text-right">
            <Eyebrow>{item.eyebrow}</Eyebrow>
            <h3 className="text-[clamp(48px,7vw,104px)] font-semibold leading-[1] tracking-[-0.03em] text-white">
              {item.title}
            </h3>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <Eyebrow>{item.eyebrow}</Eyebrow>
            <h3 className="text-[clamp(48px,7vw,104px)] font-semibold leading-[1] tracking-[-0.03em] text-white">
              {item.title}
            </h3>
          </div>
          <div className="w-full max-w-[900px]">
            <DocSkeleton />
          </div>
        </>
      )}
    </motion.div>
  );
}
