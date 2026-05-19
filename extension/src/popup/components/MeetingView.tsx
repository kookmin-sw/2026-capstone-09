import { useEffect, useRef, useState } from 'react';
import { logout } from '../../api/authApi';
import { getProjects, getNodesWithActiveMeeting } from '../../api/meetingApi';
import type { MeetingContext, NodeSummary, ProjectSummary, StatusResponse, UserData } from '../../types';

interface Props {
  user: UserData;
  onLogout: () => void;
}

type View = 'status' | 'setup';

const s = {
  container: { padding: 20 } as const,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  } as const,
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 4,
    marginTop: 14,
  } as const,
  select: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 13,
    background: '#fff',
    color: '#111827',
    cursor: 'pointer',
  } as const,
  primaryBtn: {
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    borderRadius: 8,
    background: '#4f46e5',
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: 18,
  } as const,
  dangerBtn: {
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    borderRadius: 8,
    background: '#ef4444',
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: 14,
  } as const,
  card: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '10px 14px',
  } as const,
  dot: (active: boolean) =>
    ({
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: active ? '#22c55e' : '#9ca3af',
      display: 'inline-block',
      marginRight: 6,
    }) as const,
};

function formatRelativeTime(ts: number | null): string {
  if (!ts) return '-';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}초 전`;
  return `${Math.floor(diff / 60)}분 전`;
}

export function MeetingView({ user, onLogout }: Props) {
  const [view, setView] = useState<View>('status');
  const [status, setStatus] = useState<StatusResponse | null>(null);

  // setup 상태
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [nodes, setNodes] = useState<NodeSummary[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const statusTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    refreshStatus();
    statusTimer.current = setInterval(refreshStatus, 5000);
    return () => {
      if (statusTimer.current) clearInterval(statusTimer.current);
    };
  }, []);

  useEffect(() => {
    if (view === 'setup') {
      getProjects()
        .then(setProjects)
        .catch(() => setSetupError('프로젝트 목록을 불러오지 못했습니다.'));
    }
  }, [view]);

  useEffect(() => {
    if (!selectedProjectId) return;
    setNodes([]);
    setSelectedNodeId(null);
    getNodesWithActiveMeeting(selectedProjectId)
      .then((list) => {
        setNodes(list);
        if (list.length === 0) setSetupError('진행 중이거나 예정된 회의가 있는 노드가 없습니다.');
        else setSetupError(null);
      })
      .catch(() => setSetupError('노드 목록을 불러오지 못했습니다.'));
  }, [selectedProjectId]);

  const refreshStatus = () => {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res: StatusResponse) => {
      setStatus(res);
    });
  };

  const handleStartCapture = async () => {
    if (!selectedProjectId || !selectedNodeId) return;
    setSetupLoading(true);
    setSetupError(null);
    try {
      const selectedNode = nodes.find((n) => n.nodeId === selectedNodeId);
      if (!selectedNode) {
        setSetupError('선택한 노드의 회의 정보를 찾을 수 없습니다.');
        return;
      }
      const context: MeetingContext = {
        projectId: selectedProjectId,
        nodeId: selectedNodeId,
        meetingId: selectedNode.meetingId,
      };
      await chrome.runtime.sendMessage({ type: 'SET_MEETING_CONTEXT', context });
      await chrome.runtime.sendMessage({ type: 'START_CAPTURE' });
      await refreshStatus();
      setView('status');
    } catch {
      setSetupError('회의 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleEndMeeting = async () => {
    if (!confirm('회의를 종료하면 자막이 저장되고 AI 요약이 시작됩니다.\n종료하시겠습니까?')) return;
    await chrome.runtime.sendMessage({ type: 'MEETING_ENDED' });
    refreshStatus();
  };

  const handleLogout = () => {
    logout().then(onLogout);
  };

  // ── Setup View ─────────────────────────────────────────────
  if (view === 'setup') {
    return (
      <div style={s.container}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setView('status')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              color: '#6b7280',
              lineHeight: 1,
              padding: '2px 4px',
            }}
          >
            ←
          </button>
          <span style={{ fontSize: 15, fontWeight: 600 }}>FlowMeet 회의 연결</span>
        </div>

        <label style={s.label}>프로젝트</label>
        <select
          style={s.select}
          defaultValue=""
          onChange={(e) => setSelectedProjectId(Number(e.target.value) || null)}
        >
          <option value="" disabled>
            프로젝트를 선택하세요
          </option>
          {projects.map((p) => (
            <option key={p.projectId} value={p.projectId}>
              {p.name}
            </option>
          ))}
        </select>

        <label style={{ ...s.label, color: selectedProjectId ? '#374151' : '#9ca3af' }}>
          노드 (예정·진행 중인 회의가 있는 노드만 표시)
        </label>
        <select
          style={{ ...s.select, background: selectedProjectId ? '#fff' : '#f9fafb' }}
          disabled={!selectedProjectId}
          defaultValue=""
          onChange={(e) => setSelectedNodeId(Number(e.target.value) || null)}
        >
          <option value="" disabled>
            노드를 선택하세요
          </option>
          {nodes.map((n) => (
            <option key={n.nodeId} value={n.nodeId}>
              {n.title}
            </option>
          ))}
        </select>

        {setupError && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#dc2626' }}>{setupError}</div>
        )}

        <button
          onClick={handleStartCapture}
          disabled={!selectedNodeId || setupLoading}
          style={{
            ...s.primaryBtn,
            background: selectedNodeId && !setupLoading ? '#4f46e5' : '#9ca3af',
            cursor: selectedNodeId && !setupLoading ? 'pointer' : 'not-allowed',
          }}
        >
          {setupLoading ? '연결 중...' : '자막 수집 시작'}
        </button>
      </div>
    );
  }

  // ── Status View ────────────────────────────────────────────
  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#4f46e5' }}>FlowMeet</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{user.email}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 12,
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '2px 0',
          }}
        >
          로그아웃
        </button>
      </div>

      {status?.isCapturing ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <span style={s.dot(true)} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>자막 수집 중</span>
          </div>
          <div style={s.card}>
            <Row label="수집된 자막 수" value={`${status.captionCount ?? 0}개`} />
            <Row label="마지막 전송" value={formatRelativeTime(status.lastSentAt)} />
            {status.meetingContext && (
              <Row label="회의 ID" value={`#${status.meetingContext.meetingId}`} />
            )}
          </div>
          <button style={s.dangerBtn} onClick={handleEndMeeting}>
            회의 종료 및 AI 요약 시작
          </button>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <span style={s.dot(false)} />
            <span style={{ fontSize: 14, color: '#6b7280' }}>대기 중</span>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>
            FlowMeet 회의와 연결하면 Google Meet 자막을 자동으로 저장합니다.
          </p>
          <button style={s.primaryBtn} onClick={() => setView('setup')}>
            회의 연결하기
          </button>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
        fontSize: 13,
      }}
    >
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ fontWeight: 500, color: '#111827' }}>{value}</span>
    </div>
  );
}