import { Users, type UserInfo } from '../../../../../components/commons/UserAvatarGroup';
import { ProjectViewTabs, type ProjectViewTypes } from './ProjectViewTabs';

interface ProjectDetailHeaderProps {
    activeView: ProjectViewTypes;
    onlineUsers: readonly UserInfo[];
    onViewChange: (view: ProjectViewTypes) => void;
}

export const ProjectDetailHeader = ({
                                        activeView,
                                        onlineUsers,
                                        onViewChange,
                                    }: ProjectDetailHeaderProps) => {
    return (
        <header className="relative z-10 flex h-14 shrink-0 items-center justify-between overflow-visible border-b border-line-soft bg-static-white px-4 pt-4.5 pb-4">
            <ProjectViewTabs activeView={activeView} onViewChange={onViewChange} />
            <Users users={onlineUsers}/>
        </header>
    );
};