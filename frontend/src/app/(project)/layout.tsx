'use client';

import { ProjectSidebar } from '@/components/commons/project-sidebar/ProjectSidebar';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ProjectSidebar />
      <main className="bg-surface-canvas flex h-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
