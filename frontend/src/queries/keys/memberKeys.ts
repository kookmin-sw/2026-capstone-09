export const memberKeys = {
  all: ['member'] as const,
  list: (projectId: number) => [...memberKeys.all, 'list', projectId] as const,
};
