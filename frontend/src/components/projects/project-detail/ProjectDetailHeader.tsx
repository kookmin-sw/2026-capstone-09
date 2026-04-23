import { SegmentedControl, SegmentedControlItem } from '@wanteddev/wds';
import { Box, type Theme } from '@wanteddev/wds-engine';

import { type UserInfo, Users } from '@/components/commons/user/UserAvatarGroup';
import type { ProjectViewTypes } from '@/contexts/ProjectDetailLayoutContext';

interface ProjectDetailHeaderProps {
  activeView: ProjectViewTypes;
  onlineUsers: readonly UserInfo[];
  onViewChange: (view: ProjectViewTypes) => void;
}

const PROJECT_VIEW_OPTIONS: Array<{
  label: string;
  value: ProjectViewTypes;
}> = [
  { label: '노드 플로우', value: 'node-flow' },
  { label: '리스트', value: 'list' },
  { label: '칸반', value: 'kanban' },
];

export const ProjectDetailHeader = ({
  activeView,
  onlineUsers,
  onViewChange,
}: ProjectDetailHeaderProps) => {
  return (
    <header className="border-line-soft bg-static-white relative z-10 flex h-14 shrink-0 items-center justify-between overflow-visible border-b px-4 pt-4.5 pb-4">
      <div className="shrink-0">
        <Box
          className="bg-fill-normal inline-flex w-[300px] shrink-0 rounded-md p-0.5"
          sx={(theme: Theme) => ({
            '& button': {
              flex: 1,
              minWidth: 0,
              justifyContent: 'center',
              color: theme.semantic.label.alternative,
            },
            '& button[data-state="on"]': {
              backgroundColor: theme.semantic.background.elevated.normal,
              color: theme.semantic.label.normal,
            },
          })}
        >
          <SegmentedControl
            size="small"
            value={activeView}
            onValueChange={(value) => onViewChange(value as ProjectViewTypes)}
          >
            {PROJECT_VIEW_OPTIONS.map(({ label, value }) => (
              <SegmentedControlItem key={value} value={value} className="h-8 px-3">
                {label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </Box>
      </div>

      <div className="shrink-0">
        <Users users={onlineUsers} />
      </div>
    </header>
  );
};
