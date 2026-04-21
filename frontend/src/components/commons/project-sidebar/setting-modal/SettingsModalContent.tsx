'use client';

import { IconClose } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { MembersSettingsPanel } from './MembersSettingsPanel';
import { NotificationsSettingsPanel } from './NotificationsSettingsPanel';
import { ProjectSettingsPanel } from './ProjectSettingsPanel';
import { SettingsSidebarNav } from './SettingsSidebarNav';
import { TAB_TITLE_MAP, type SettingsTab } from './types';

interface SettingsModalContentProps {
  onClose: () => void;
}

/**
 * 설정 모달의 레이아웃 쉘(탭 사이드바 + 본문).
 * 탭별 비즈니스 로직은 하위 *Panel 컴포넌트로 각각 분리되어 있다.
 *
 * NOTE: Modal의 `variant="sidebar"`를 쓰면 좌측 그레이 패널이 제공되지만,
 * `activeTab` 상태를 사이드바와 본문이 공유해야 해서 여기서는 하나의 content 트리로
 * 그려 둔다. 기본 variant의 `p-12`를 상쇄하기 위한 `-m-12`가 여기에 남아있다.
 */
export const SettingsModalContent = ({ onClose }: SettingsModalContentProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('project');

  return (
    <div className="-m-12 flex h-144 items-stretch gap-8 pr-12">
      <aside className="bg-background-normal-alternative w-50 shrink-0 overflow-hidden p-6">
        <SettingsSidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      <section className="flex min-h-0 flex-1 flex-col gap-8 py-6">
        {/* 헤더 */}
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

        {/* 본문 */}
        <div className="flex min-h-0 flex-1 flex-col">
          {activeTab === 'project' && <ProjectSettingsPanel />}
          {activeTab === 'members' && <MembersSettingsPanel />}
          {activeTab === 'notifications' && <NotificationsSettingsPanel />}
        </div>
      </section>
    </div>
  );
};

SettingsModalContent.displayName = 'SettingsModalContent';
