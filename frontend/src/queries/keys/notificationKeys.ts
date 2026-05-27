export const notificationKeys = {
  all: ['notification'] as const,
  setting: (projectId: number) => [...notificationKeys.all, 'setting', projectId] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};
