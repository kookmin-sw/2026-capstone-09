'use client';

import { useState, useEffect, useMemo } from 'react';

import { ProjectDetailHeader } from '@/components/projects/project-detail/ProjectDetailHeader';
import { ProjectDetailLinks } from '@/components/projects/project-detail/ProjectDetailLinks';
import { EXAMPLE_USERS } from '@/constants/exampleConstant';
import {
  ProjectDetailLayoutContext,
  type ProjectViewTypes,
  VALID_VIEWS,
} from '@/contexts/ProjectDetailLayoutContext';

interface ProjectDetailLayoutProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'project-active-view';

export default function ProjectDetailLayout({ children }: ProjectDetailLayoutProps) {
  const [activeView, setActiveView] = useState<ProjectViewTypes>(() => {
    if (typeof window === 'undefined') return 'node-flow';
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && VALID_VIEWS.includes(saved as ProjectViewTypes)
      ? (saved as ProjectViewTypes)
      : 'node-flow';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeView);
  }, [activeView]);

  const contextValue = useMemo(() => ({ activeView }), [activeView]);

  return (
    <ProjectDetailLayoutContext.Provider value={contextValue}>
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden" suppressHydrationWarning>
        <ProjectDetailHeader activeView={activeView} onlineUsers={EXAMPLE_USERS} onViewChange={setActiveView} />
        <ProjectDetailLinks />
        {children}
      </div>
    </ProjectDetailLayoutContext.Provider>
  );
}
