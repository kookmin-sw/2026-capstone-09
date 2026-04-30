'use client';

import { IconClose } from '@wanteddev/wds-icon';
import { useEffect, useState } from 'react';

import { privateApi } from '@/api';

import { MembersSettingsPanel } from './MembersSettingsPanel';
import { NotificationsSettingsPanel } from './NotificationsSettingsPanel';
import { ProjectSettingsPanel } from './ProjectSettingsPanel';
import { SettingsSidebarNav } from './SettingsSidebarNav';
import { TAB_TITLE_MAP, type SettingsTab } from './types';

export type ProjectMemberRole = 'VIEWER' | 'MEMBER' | 'OWNER';

interface SettingsModalContentProps {
  projectId: number;
  onClose: () => void;
}

/**
 * 프로젝트 설정 모달의 레이아웃 셸 (탭 사이드바 + 본문).
 *
 * - 자식 패널들에서 권한 분기 UI(소유자만 삭제·다른 권한은 나가기 등)가 필요해
 *   여기서 `getProject` 한 번 호출해 `myRole` 만 추출해 자식에게 prop으로 내려준다.
 * - 패널 내부에서 별도로 `getProject` 를 호출해야 하는 경우(이름·구성원 수 등 비교적
 *   변동이 잦은 메타데이터)는 자체 fetch 를 유지한다.
 */
export const SettingsModalContent = ({ projectId, onClose }: SettingsModalContentProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('project');
  const [myRole, setMyRole] = useState<ProjectMemberRole | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchMyRole = async () => {
      try {
        const response = await privateApi.project.getProject(projectId);
        if (cancelled) return;
        const role = response.data.data?.myRole;
        if (role === 'OWNER' || role === 'MEMBER' || role === 'VIEWER') {
          setMyRole(role);
        }
      } catch (caught) {
        if (cancelled) return;
        console.error('내 권한 조회에 실패했어요.', caught);
      }
    };
    void fetchMyRole();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <div className="-m-12 flex h-144 items-stretch gap-8 pr-12">
      <aside className="bg-background-normal-alternative w-50 shrink-0 overflow-hidden p-6">
        <SettingsSidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      <section className="flex min-h-0 flex-1 flex-col gap-8 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-1 text-label-normal font-medium">
            {TAB_TITLE_MAP[activeTab]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
          >
            <IconClose className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {activeTab === 'project' && (
            <ProjectSettingsPanel
              projectId={projectId}
              myRole={myRole}
              onSettingsClose={onClose}
            />
          )}
          {activeTab === 'members' && (
            <MembersSettingsPanel projectId={projectId} myRole={myRole} />
          )}
          {activeTab === 'notifications' && <NotificationsSettingsPanel />}
        </div>
      </section>
    </div>
  );
};

SettingsModalContent.displayName = 'SettingsModalContent';
