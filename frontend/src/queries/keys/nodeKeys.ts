export const nodeKeys = {
  all: ['node'] as const,
  detail: (projectId: number, nodeId: number) =>
    [...nodeKeys.all, 'detail', projectId, nodeId] as const,
};
