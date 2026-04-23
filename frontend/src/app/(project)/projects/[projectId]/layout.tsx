'use client';

import { useState } from 'react';

import { ProjectDetailHeader } from '@/components/projects/project-detail/ProjectDetailHeader';
import { ProjectDetailLinks } from '@/components/projects/project-detail/ProjectDetailLinks';
import { EXAMPLE_USERS } from '@/constants/exampleConstant';
import {
  ProjectDetailLayoutContext,
  type ProjectViewTypes,
} from '@/contexts/ProjectDetailLayoutContext';

interface ProjectDetailLayoutProps {
  children: React.ReactNode;
}

export default function ProjectDetailLayout({ children }: ProjectDetailLayoutProps) {
  const [activeView, setActiveView] = useState<ProjectViewTypes>('node-flow');

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
