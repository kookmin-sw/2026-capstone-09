'use client';

import { ProjectSidebar } from '@/components/common/project-sidebar/ProjectSidebar';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ProjectSidebar />
      <main className="bg---surface---canvas flex min-h-screen flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}

