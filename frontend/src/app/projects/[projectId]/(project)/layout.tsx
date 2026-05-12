'use client';

import { useState } from 'react';
import { ProjectDetailHeader } from '@/components/projects/project-detail/ProjectDetailHeader';
import { ProjectDetailLinks } from '@/components/projects/project-detail/ProjectDetailLinks';
import { EXAMPLE_USERS } from '@/constants/exampleConstant';
import {
  ProjectDetailLayoutContext,
  ProjectViewTypes,
} from '@/contexts/ProjectDetailLayoutContext';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ProjectViewTypes>('node-flow');

  return (
    <ProjectDetailLayoutContext.Provider value={{ activeView }}>
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <ProjectDetailHeader
          activeView={activeView}
          onlineUsers={EXAMPLE_USERS}
          onViewChange={setActiveView}
        />
        <ProjectDetailLinks />
        {children}
      </div>
    </ProjectDetailLayoutContext.Provider>
  );
}
