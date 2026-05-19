export const meetingKeys = {
  all: ['meeting'] as const,
  list: (projectId: number, nodeId: number) =>
    [...meetingKeys.all, 'list', projectId, nodeId] as const,
};
