import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

export type ProjectViewTypes = 'node-flow' | 'list' | 'kanban';

interface ProjectViewTabsProps {
  activeView: ProjectViewTypes;
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

export const ProjectViewTabs = ({ activeView, onViewChange }: ProjectViewTabsProps) => {
  return (
    <div className="inline-flex items-center rounded-lg bg-fill-normal p-0.5">
      {PROJECT_VIEW_OPTIONS.map(({ label, value }) => {
        const isActive = activeView === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onViewChange(value)}
            className="relative flex h-7 min-w-24 items-center justify-center rounded-md px-3"
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.div
                layoutId="project-view-tab-indicator"
                transition={{ type: 'spring', stiffness: 1000, damping: 50 }}
                className="absolute inset-px rounded-md bg-background-elevated-normal shadow-sm"
              />
            )}
            <span
              className={cn(
                'relative text-caption-1 font-medium',
                isActive ? 'text-label-neutral' : 'text-label-alternative',
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
