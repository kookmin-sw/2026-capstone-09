'use client';

import { useState } from 'react';

import { EXAMPLE_USERS } from '@/constants/exampleConstant';
import type { UserInfo } from '@/components/commons/UserAvatarGroup';
import { ProjectDetailHeader } from './_component/ProjectDetailHeader';
import { ProjectDetailLinks } from './_component/ProjectDetailLinks';
import { ProjectDetailPageContent } from './_component/ProjectDetailPageContent';
import type { ProjectViewTypes } from './_component/ProjectViewTabs';

export default function ProjectDetailPage() {
    const [activeView, setActiveView] = useState<ProjectViewTypes>('node-flow');

    return (
        <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
            <ProjectDetailHeader
                activeView={activeView}
                onlineUsers={EXAMPLE_USERS as readonly UserInfo[]}
                onViewChange={setActiveView}
            />
            <ProjectDetailLinks />
            <ProjectDetailPageContent activeView={activeView} />
        </div>
    );
}