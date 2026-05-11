export const tagKeys = {
  all: ['tag'] as const,
  list: (projectId: number) => [...tagKeys.all, 'list', projectId] as const,
};
