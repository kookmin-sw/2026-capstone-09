export const projectKeys = {
  all: ['project'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params: { sort: string; search: string }) =>
    [...projectKeys.lists(), params] as const,
  detail: (projectId: number) => [...projectKeys.all, 'detail', projectId] as const,
};
