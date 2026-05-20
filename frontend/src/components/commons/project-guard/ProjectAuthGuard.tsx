'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { authStorage } from '@/api/authStorage';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { projectKeys } from '@/queries/keys/projectKeys';

interface ProjectAuthGuardProps {
  children: React.ReactNode;
}

export const ProjectAuthGuard = ({ children }: ProjectAuthGuardProps) => {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);
  const toast = usePositionedToast();

  const [isLoggedIn] = useState(() => !!authStorage.getAccess());

  const { isError, isLoading } = useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => privateApi.project.getProject(projectId).then((res) => res.data.data),
    enabled: isLoggedIn && !Number.isNaN(projectId),
    retry: false,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      toast({ content: '로그인이 필요해요.', variant: 'negative', placement: 'top-center' });
      router.replace('/auth/login');
      return;
    }

    if (isError) {
      toast({ content: '접근 권한이 없는 프로젝트예요.', variant: 'negative', placement: 'top-center' });
      router.replace('/projects');
    }
  }, [isLoggedIn, isError, router, toast]);

  if (!isLoggedIn || isLoading || isError) return null;

  return <>{children}</>;
};
