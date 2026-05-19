import { apiFetch } from './client';
import type { ProjectSummary, NodeSummary } from '../types';

interface CursorSliceResponse<T> {
  content?: T[];
}

interface GetNodeResponse {
  nodeId?: number;
  title?: string;
  meeting?: {
    meetingId?: number;
    meetingUrl?: string;
    status?: string;
  };
}

interface GetNodeListResponse {
  nodes?: Array<{
    nodeId?: number;
    title?: string;
    hasMeeting?: boolean;
  }>;
}

export async function endMeeting(
  projectId: number,
  nodeId: number,
  meetingId: number,
): Promise<void> {
  await apiFetch(
    `/v1/projects/${projectId}/nodes/${nodeId}/meetings/${meetingId}/end`,
    { method: 'PATCH' },
  );
}

export async function getProjects(): Promise<ProjectSummary[]> {
  const res = await apiFetch<CursorSliceResponse<{ projectId?: number; name?: string }>>(
    '/v1/projects?size=50',
  );
  return (
    res.data?.content?.map((p) => ({
      projectId: p.projectId ?? 0,
      name: p.name ?? '',
    })) ?? []
  );
}

// hasMeeting: true인 노드들의 getNode를 병렬 호출해 ENDED가 아닌 회의만 반환
export async function getNodesWithActiveMeeting(projectId: number): Promise<NodeSummary[]> {
  const listRes = await apiFetch<GetNodeListResponse>(
    `/v1/projects/${projectId}/nodes/list`,
  );

  const nodesWithMeeting = listRes.data?.nodes?.filter((n) => n.hasMeeting && n.nodeId) ?? [];

  if (nodesWithMeeting.length === 0) return [];

  const details = await Promise.all(
    nodesWithMeeting.map((n) =>
      apiFetch<GetNodeResponse>(`/v1/projects/${projectId}/nodes/${n.nodeId}`)
        .then((r) => ({ nodeId: n.nodeId!, title: n.title ?? '', meeting: r.data?.meeting }))
        .catch(() => ({ nodeId: n.nodeId!, title: n.title ?? '', meeting: undefined })),
    ),
  );

  return details
    .filter(
      (d) =>
        d.meeting?.meetingId != null &&
        d.meeting.status !== 'ENDED',
    )
    .map((d) => ({
      nodeId: d.nodeId,
      title: d.title,
      meetingId: d.meeting!.meetingId!,
    }));
}