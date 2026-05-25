export const searchKeys = {
  all: ['search'] as const,
  results: (projectId: number, query: string) =>
    [...searchKeys.all, 'results', projectId, query] as const,
};
