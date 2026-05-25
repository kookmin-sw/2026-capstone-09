import { apiFetch } from './client';

export async function appendTranscript(
  projectId: number,
  nodeId: number,
  meetingId: number,
  content: string,
): Promise<void> {
  await apiFetch(
    `/v1/projects/${projectId}/nodes/${nodeId}/meetings/${meetingId}/transcripts`,
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    },
  );
}
