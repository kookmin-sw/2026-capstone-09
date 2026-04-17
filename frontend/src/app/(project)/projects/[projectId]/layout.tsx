'use client';

import { createContext, useContext, useState } from 'react';

import { ProjectDetailHeader } from '@/components/projects/project-detail/ProjectDetailHeader';
import { ProjectDetailLinks } from '@/components/projects/project-detail/ProjectDetailLinks';
import { EXAMPLE_USERS } from '@/constants/exampleConstant';

export type ProjectViewTypes = 'node-flow' | 'list' | 'kanban';

interface ProjectDetailLayoutContextProps {
  activeView: ProjectViewTypes;
}

interface ProjectDetailLayoutProps {
  children: React.ReactNode;
}

const ProjectDetailLayoutContext = createContext<ProjectDetailLayoutContextProps | null>(null);

export const useProjectDetailLayout = () => {
  const context = useContext(ProjectDetailLayoutContext);

  if (!context) {
    throw new Error('useProjectDetailLayout must be used within ProjectDetailLayout');
  }

  return context;
};

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
