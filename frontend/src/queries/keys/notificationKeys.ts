export const notificationKeys = {
  all: ['notification'] as const,
  setting: (projectId: number) => [...notificationKeys.all, 'setting', projectId] as const,
};
