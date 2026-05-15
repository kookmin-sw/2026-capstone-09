import { IconCheck, IconClose, IconFire, IconMoreHorizontal, IconPause } from '@wanteddev/wds-icon';

export type NodeStatusType = 'WAITING' | 'IN_PROGRESS' | 'DONE' | 'ON_HOLD' | 'CLOSED';

export const NODE_STATUS_INFO: Record<
  NodeStatusType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  WAITING: {
    label: '진행 전',
    color: 'semantic.label.strong',
    icon: <IconMoreHorizontal />,
  },
  IN_PROGRESS: {
    label: '진행 중',
    color: 'semantic.accent.foreground.redOrange',
    icon: <IconFire />,
  },
  DONE: {
    label: '완료',
    color: 'semantic.accent.foreground.green',
    icon: <IconCheck />,
  },
  ON_HOLD: {
    label: '보류',
    color: 'semantic.accent.foreground.violet',
    icon: <IconPause />,
  },
  CLOSED: {
    label: '종료',
    color: 'semantic.accent.foreground.red',
    icon: <IconClose />,
  },
} as const;
