export const nodeKeys = {
  all: ['node'] as const,
  detail: (projectId: number, nodeId: number | null) =>
    [...nodeKeys.all, 'detail', projectId, nodeId] as const,
};
