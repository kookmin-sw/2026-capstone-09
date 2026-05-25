export type SettingsTab = 'project' | 'members' | 'notifications';

export const TAB_TITLE_MAP: Record<SettingsTab, string> = {
  project: '프로젝트 설정',
  members: '멤버 설정',
  notifications: '알림 설정',
};
