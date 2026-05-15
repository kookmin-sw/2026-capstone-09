'use client';

import { createContext, useContext } from 'react';

export type ProjectViewTypes = 'node-flow' | 'list' | 'kanban';

export const VALID_VIEWS: readonly ProjectViewTypes[] = ['node-flow', 'list', 'kanban'] as const;

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