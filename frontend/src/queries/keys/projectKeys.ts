export const projectKeys = {
  all: ['project'] as const,
  detail: (projectId: number) => [...projectKeys.all, 'detail', projectId] as const,
};
