'use client';

import { createContext, useContext } from 'react';

export type ProjectViewTypes = 'node-flow' | 'list' | 'kanban';

interface ProjectDetailLayoutContextProps {
  activeView: ProjectViewTypes;
}

export const ProjectDetailLayoutContext = createContext<ProjectDetailLayoutContextProps | null>(null);

export const useProjectDetailLayout = () => {
  const context = useContext(ProjectDetailLayoutContext);

  if (!context) {
    throw new Error('useProjectDetailLayout must be used within ProjectDetailLayout');
  }

  return context;
};