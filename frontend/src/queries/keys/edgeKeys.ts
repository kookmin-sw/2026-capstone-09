export const edgeKeys = {
  all: ['edge'] as const,
  linked: (projectId: number, nodeId: number) =>
    [...edgeKeys.all, 'linked', projectId, nodeId] as const,
  nodeList: (projectId: number) => [...edgeKeys.all, 'nodeList', projectId] as const,
};
