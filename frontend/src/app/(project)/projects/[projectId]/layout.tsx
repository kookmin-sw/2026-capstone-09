'use client';

import { useState, useEffect } from 'react';

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
  const [activeView, setActiveView] = useState<ProjectViewTypes>('node-flow');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_VIEWS.includes(saved as ProjectViewTypes)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveView(saved as ProjectViewTypes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeView);
  }, [activeView]);

  return (
    <ProjectDetailLayoutContext.Provider value={{ activeView }}>
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <ProjectDetailHeader activeView={activeView} onlineUsers={EXAMPLE_USERS} onViewChange={setActiveView} />
        <ProjectDetailLinks />
        {children}
      </div>
    </ProjectDetailLayoutContext.Provider>
  );
}
