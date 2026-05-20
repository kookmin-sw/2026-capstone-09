'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { ProjectDetailHeader } from '@/components/projects/project-detail/ProjectDetailHeader';
import { ProjectDetailLinks } from '@/components/projects/project-detail/ProjectDetailLinks';
import { EXAMPLE_USERS } from '@/constants/exampleConstant';
import {
  ProjectDetailLayoutContext,
  VALID_VIEWS,
  ProjectViewTypes,
} from '@/contexts/ProjectDetailLayoutContext';

const STORAGE_KEY = 'project-active-view';

interface ProjectDetailLayoutProps {
  children: React.ReactNode;
}

export default function ProjectDetailLayout({ children }: ProjectDetailLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<ProjectViewTypes>(() => {
    if (typeof window === 'undefined') return 'node-flow';

    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && VALID_VIEWS.includes(saved as ProjectViewTypes)
      ? (saved as ProjectViewTypes)
      : 'node-flow';
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, activeView);
    }
  }, [activeView, mounted]);

  const contextValue = useMemo(() => ({ activeView }), [activeView]);

  if (!mounted) {
    return null;
  }

  return (
    <ProjectDetailLayoutContext.Provider value={contextValue}>
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden" suppressHydrationWarning>
        <ProjectDetailHeader
          activeView={activeView}
          onlineUsers={EXAMPLE_USERS}
          onViewChange={setActiveView}
        />
        <ProjectDetailLinks />
        {children}
        <ChatWidget />
      </div>
    </ProjectDetailLayoutContext.Provider>
  );
}
