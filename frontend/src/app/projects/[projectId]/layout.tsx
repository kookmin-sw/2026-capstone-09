'use client';

import { useParams } from 'next/navigation';
import { ProjectAuthGuard } from '@/components/commons/project-guard/ProjectAuthGuard';
import { ProjectSidebar } from '@/components/commons/project-sidebar/ProjectSidebar';
import { ProjectPresenceProvider } from '@/contexts/YjsContext';

interface ProjectDetailLayoutProps {
  children: React.ReactNode;
}

export default function ProjectDetailLayout({ children }: ProjectDetailLayoutProps) {
  const params = useParams<{ projectId?: string }>();
  const projectIdRaw = params?.projectId;
  const projectId = projectIdRaw ? Number(projectIdRaw) : NaN;
  const isProjectIdValid = Number.isFinite(projectId);

  const layout = (
    <ProjectAuthGuard>
      <div className="flex h-screen overflow-hidden">
        <ProjectSidebar />
        <main className="bg-surface-canvas flex h-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </ProjectAuthGuard>
  );

  if (!isProjectIdValid) return layout;

  return <ProjectPresenceProvider projectId={projectId}>{layout}</ProjectPresenceProvider>;
}
