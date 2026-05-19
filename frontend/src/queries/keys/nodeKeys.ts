export const nodeKeys = {
  all: ['node'] as const,
  list: (projectId: number, sort?: string) =>
    [...nodeKeys.all, 'list', projectId, sort] as const,
  detail: (projectId: number, nodeId: number | null) =>
    [...nodeKeys.all, 'detail', projectId, nodeId] as const,
  flowchart: (projectId: number) =>
    [...nodeKeys.all, 'flowchart', projectId] as const,
};
