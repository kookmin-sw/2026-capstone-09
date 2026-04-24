export type ColorType =
  | 'NEUTRAL'
  | 'RED'
  | 'RED_ORANGE'
  | 'ORANGE'
  | 'LIME'
  | 'GREEN'
  | 'CYAN'
  | 'LIGHT_BLUE'
  | 'BLUE'
  | 'VIOLET'
  | 'PURPLE'
  | 'PINK';

export const BADGE_INFO: Record<ColorType, { label: string; colorToken: string }> = {
  NEUTRAL: {
    label: '회색',
    colorToken: 'semantic.label.strong',
  },
  RED: {
    label: '빨강',
    colorToken: 'semantic.accent.foreground.red',
  },
  RED_ORANGE: {
    label: '다홍',
    colorToken: 'semantic.accent.foreground.redOrange',
  },
  ORANGE: {
    label: '주황',
    colorToken: 'semantic.accent.foreground.orange',
  },
  LIME: {
    label: '라임',
    colorToken: 'semantic.accent.foreground.lime',
  },
  GREEN: {
    label: '초록',
    colorToken: 'semantic.accent.foreground.green',
  },
  CYAN: {
    label: '청록',
    colorToken: 'semantic.accent.foreground.cyan',
  },
  LIGHT_BLUE: {
    label: '하늘',
    colorToken: 'semantic.accent.foreground.lightBlue',
  },
  BLUE: {
    label: '파랑',
    colorToken: 'semantic.accent.foreground.blue',
  },
  VIOLET: {
    label: '보라',
    colorToken: 'semantic.accent.foreground.violet',
  },
  PURPLE: {
    label: '연분홍',
    colorToken: 'semantic.accent.foreground.purple',
  },
  PINK: {
    label: '분홍',
    colorToken: 'semantic.accent.foreground.pink',
  },
} as const;
