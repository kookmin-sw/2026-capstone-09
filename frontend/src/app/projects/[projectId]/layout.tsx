'use client';

import { ProjectAuthGuard } from '@/components/commons/project-guard/ProjectAuthGuard';
import { ProjectSidebar } from '@/components/commons/project-sidebar/ProjectSidebar';

interface ProjectDetailLayoutProps {
  children: React.ReactNode;
}

export default function ProjectDetailLayout({ children }: ProjectDetailLayoutProps) {
  return (
    <ProjectAuthGuard>
      <div className="flex h-screen overflow-hidden">
        <ProjectSidebar />
        <main className="bg-surface-canvas flex h-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </ProjectAuthGuard>
  );
}
