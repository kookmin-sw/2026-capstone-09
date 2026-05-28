'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { DownloadButton } from './ui/DownloadButton';
import { GoogleLoginButton } from './ui/GoogleLoginButton';
import { asset } from '@/lib/asset';

const TABS = [
  { id: 'intro', label: '소개' },
  { id: 'features', label: '기능' },
  { id: 'docs', label: '문서' },
  { id: 'team', label: '팀원' },
];

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('intro');

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    const updateActiveSection = () => {
      const sections = TABS.map((tab) => document.getElementById(tab.id)).filter(Boolean) as HTMLElement[];
      const scrollTarget = window.scrollY + window.innerHeight * 0.35;
      const current = sections
        .filter((section) => section.offsetTop <= scrollTarget)
        .at(-1);

      if (current) setActive(current.id);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.06] bg-[rgba(5,6,8,0.72)] backdrop-blur-xl'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="relative mx-auto flex h-16 max-w-[1280px] items-center px-4 sm:px-6 lg:px-10">
        <a
          href="#top"
          className="group flex flex-none items-center gap-2"
          aria-label="flowMeet 홈"
        >
          <Image
            src={asset('/flowmeet-logo.svg')}
            alt="flowMeet"
            width={120}
            height={28}
            priority
            className="h-7 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 lg:flex">
          {TABS.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              className="relative rounded-full px-5 py-2 text-[15px] font-medium text-[var(--color-text-muted)] transition-colors hover:text-white"
            >
              {active === tab.id && (
                <motion.span
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-full bg-white/[0.06] ring-1 ring-white/[0.08]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </a>
          ))}
        </nav>

        <div className="absolute right-4 z-10 hidden flex-none items-center justify-end gap-2.5 md:flex sm:right-6 lg:right-10">
          <span className="hidden sm:inline-flex">
            <DownloadButton size="sm" />
          </span>
          <GoogleLoginButton size="sm" />
        </div>
      </div>
    </motion.header>
  );
}
