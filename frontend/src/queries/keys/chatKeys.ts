export const chatKeys = {
  all: ['chat'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: (projectId: number, filters?: { search?: string; cursorId?: number; size?: number }) =>
    [...chatKeys.lists(), projectId, filters] as const,
  details: () => [...chatKeys.all, 'detail'] as const,
  detail: (projectId: number, chatSessionId: number, filters?: { cursorId?: number; size?: number }) =>
    [...chatKeys.details(), projectId, chatSessionId, filters] as const,
  nodes: () => [...chatKeys.all, 'nodes'] as const,
  referenceNodes: (projectId: number) => [...chatKeys.nodes(), projectId] as const,
  users: () => [...chatKeys.all, 'users'] as const,
  referenceUsers: (projectId: number) => [...chatKeys.users(), projectId] as const,
};