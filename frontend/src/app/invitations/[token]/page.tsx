'use client';

import { Loading } from '@wanteddev/wds';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { authStorage } from '@/api/authStorage';
import { toastStore } from '@/components/commons/custom-toast/toastStore';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useAcceptInvitationMutation } from '@/queries/project';

let toastCount = 0;

function getProjectIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.projectId === 'number' ? payload.projectId : null;
  } catch {
    return null;
  }
}

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const hasProcessed = useRef(false);
  const acceptMutation = useAcceptInvitationMutation();
  const errorToast = useErrorToast();

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const isAuthenticated = !!authStorage.getAccess();

    if (!isAuthenticated) {
      sessionStorage.setItem('pending_redirect', `/invitations/${token}`);
      router.replace('/auth/google');
      return;
    }

    acceptMutation.mutate(token, {
      onSuccess: (data) => {
        const projectId = data.data?.projectId;
        if (projectId) {
          toastStore.add({
            id: `invitation-${++toastCount}`,
            content: '프로젝트에 합류했어요.',
            variant: 'positive',
            placement: 'top-center',
          });
          router.replace(`/projects/${projectId}`);
        } else {
          router.replace('/projects');
        }
      },
      onError: (err) => {
        const code = (err as { error?: { code?: string } }).error?.code;
        if (code === 'MEMBER_ALREADY_EXISTS') {
          const projectId = getProjectIdFromToken(token);
          if (projectId) {
            router.replace(`/projects/${projectId}`);
            return;
          }
        }
        errorToast(err, '초대 링크가 유효하지 않거나 만료됐어요.');
        router.replace('/projects');
      },
    });
  }, [token, router, acceptMutation, errorToast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading />
    </div>
  );
}
