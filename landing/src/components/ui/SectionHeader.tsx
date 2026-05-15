'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'left';
  titleClassName?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  titleClassName = 'leading-[1.05]',
}: SectionHeaderProps) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <div className={`flex flex-col gap-7 ${alignCls}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <Eyebrow align={align === 'center' ? 'center' : 'left'}>{eyebrow}</Eyebrow>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className={[
          'text-balance text-[clamp(34px,8vw,84px)] font-semibold tracking-[-0.025em] text-white',
          titleClassName,
        ].join(' ')}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-[720px] text-balance text-[17px] leading-[1.7] text-[var(--color-text-muted)]"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
