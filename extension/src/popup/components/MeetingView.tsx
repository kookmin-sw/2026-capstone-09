import { useEffect, useRef, useState } from "react";
import { logout } from "../../api/authApi";
import { getProjects, getNodesWithActiveMeeting } from "../../api/meetingApi";
import { color, radius } from "../tokens";
import { FlowMeetLogo, PrimaryButton, DangerButton } from "./LoginView";
import type {
  MeetingContext,
  NodeSummary,
  ProjectSummary,
  StatusResponse,
  UserData,
} from "../../types";

interface Props {
  user: UserData;
  onLogout: () => void;
}

type View = "status" | "setup";

function formatRelativeTime(ts: number | null): string {
  if (!ts) return "-";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}초 전`;
  return `${Math.floor(diff / 60)}분 전`;
}

export function MeetingView({ user, onLogout }: Props) {
  const [view, setView] = useState<View>("status");
  const [status, setStatus] = useState<StatusResponse | null>(null);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [nodes, setNodes] = useState<NodeSummary[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    refreshStatus();
    timer.current = setInterval(refreshStatus, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (view === "setup") {
      getProjects()
        .then(setProjects)
        .catch(() => setSetupError("프로젝트 목록을 불러오지 못했습니다."));
    }
  }, [view]);

  useEffect(() => {
    if (!selectedProjectId) return;
    setNodes([]);
    setSelectedNodeId(null);
    setSetupError(null);
    setLoadingNodes(true);
    getNodesWithActiveMeeting(selectedProjectId)
      .then((list) => {
        setNodes(list);
        if (list.length === 0)
          setSetupError(
            "진행 예정이거나 진행 중인 회의가 있는 노드가 없습니다.",
          );
      })
      .catch(() => setSetupError("노드 목록을 불러오지 못했습니다."))
      .finally(() => setLoadingNodes(false));
  }, [selectedProjectId]);

  const refreshStatus = () => {
    chrome.runtime.sendMessage({ type: "GET_STATUS" }, (res: StatusResponse) =>
      setStatus(res),
    );
  };

  const handleStartCapture = async () => {
    if (!selectedProjectId || !selectedNodeId) return;
    setSetupLoading(true);
    setSetupError(null);
    try {
      const node = nodes.find((n) => n.nodeId === selectedNodeId);
      if (!node) {
        setSetupError("선택한 노드 정보를 찾을 수 없습니다.");
        return;
      }
      const context: MeetingContext = {
        projectId: selectedProjectId,
        nodeId: selectedNodeId,
        meetingId: node.meetingId,
      };
      await chrome.runtime.sendMessage({
        type: "SET_MEETING_CONTEXT",
        context,
      });
      await chrome.runtime.sendMessage({ type: "START_CAPTURE" });
      refreshStatus();
      setView("status");
    } catch {
      setSetupError("회의 연결에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleEndMeeting = async () => {
    if (
      !confirm(
        "회의를 종료하면 자막이 저장되고 AI 요약이 시작됩니다.\n종료하시겠습니까?",
      )
    )
      return;
    await chrome.runtime.sendMessage({ type: "MEETING_ENDED" });
    refreshStatus();
  };

  const handleAbortCapture = async () => {
    if (
      !confirm(
        "수집을 중단하면 저장된 자막이 모두 삭제됩니다.\n중단하시겠습니까?",
      )
    )
      return;
    await chrome.runtime.sendMessage({ type: "ABORT_CAPTURE" });
    refreshStatus();
  };

  const handleLogout = () => logout().then(onLogout);

  // ── Setup View ────────────────────────────────────────────────
  if (view === "setup") {
    return (
      <div style={{ padding: "20px" }}>
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setView("status")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
              color: color.labelAlternative,
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ←
          </button>
          <span
            style={{ fontSize: 15, fontWeight: 700, color: color.labelNormal }}
          >
            회의 연결
          </span>
        </div>

        {/* 프로젝트 */}
        <label style={labelStyle}>프로젝트</label>
        <SelectBox
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
        </SelectBox>

        {/* 노드 */}
        <label
          style={{
            ...labelStyle,
            color: selectedProjectId
              ? color.labelNeutral
              : color.labelAssistive,
          }}
        >
          노드
          <span
            style={{
              marginLeft: 4,
              fontSize: 11,
              fontWeight: 400,
              color: color.labelAssistive,
            }}
          >
            예정·진행 중인 회의가 있는 노드만 표시
          </span>
        </label>
        <SelectBox
          disabled={!selectedProjectId || loadingNodes}
          defaultValue=""
          onChange={(e) => setSelectedNodeId(Number(e.target.value) || null)}
          style={{
            background:
              !selectedProjectId || loadingNodes
                ? color.bgAlternative
                : color.bgNormal,
          }}
        >
          <option value="" disabled>
            {loadingNodes ? "불러오는 중…" : "노드를 선택하세요"}
          </option>
          {nodes.map((n) => (
            <option key={n.nodeId} value={n.nodeId}>
              {n.title}
            </option>
          ))}
        </SelectBox>

        {setupError && <ErrorNote>{setupError}</ErrorNote>}

        <PrimaryButton
          onClick={handleStartCapture}
          disabled={!selectedNodeId || setupLoading}
          style={{ marginTop: 20 }}
        >
          {setupLoading ? "연결 중…" : "자막 수집 시작"}
        </PrimaryButton>
      </div>
    );
  }

  // ── Status View ───────────────────────────────────────────────
  const captionCount = status?.captionCount ?? 0;
  const pendingCount = status?.pendingCount ?? 0;
  const isCapturing = status?.isCapturing ?? false;
  const noCaptionDetected = isCapturing && captionCount === 0;

  return (
    <div style={{ padding: "16px 20px 20px" }}>
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <FlowMeetLogo />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: color.labelAlternative }}>
            {user.nickname}
          </span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 12,
              color: color.labelAssistive,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 0",
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      <Divider />

      {isCapturing ? (
        <div style={{ marginTop: 14 }}>
          {/* 수집 중 상태 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color.positive,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: color.labelNormal,
              }}
            >
              자막 수집 중
            </span>
          </div>

          {/* 자막 미감지 경고 */}
          {noCaptionDetected && (
            <div
              style={{
                background: color.cautionaryBg,
                border: `1px solid rgba(255,146,0,0.3)`,
                borderRadius: radius.md,
                padding: "12px 14px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#A05C00",
                  marginBottom: 6,
                }}
              >
                ⚠️ 자막이 감지되지 않고 있어요
              </div>
              <div style={{ fontSize: 12, color: "#7A4500", lineHeight: 1.7 }}>
                Google Meet에서 자막을 켜주세요.
                <br />
                하단 바에서 <b>CC</b> 버튼을 누르거나
                <br />
                단축키 <b>c</b>를 누르면 자막이 활성화됩니다.
              </div>
            </div>
          )}

          {/* 통계 카드 */}
          <div
            style={{
              background: color.bgAlternative,
              border: `1px solid ${color.lineNeutral}`,
              borderRadius: radius.md,
              padding: "10px 14px",
              marginBottom: 14,
            }}
          >
            <StatRow label="수집된 자막" value={`${captionCount}개`} />
            <StatRow label="전송 대기" value={`${pendingCount}개`} />
            <StatRow
              label="마지막 전송"
              value={formatRelativeTime(status?.lastSentAt ?? null)}
            />
          </div>

          {/* 자막 활성화 안내 (항상 표시) */}
          {!noCaptionDetected && (
            <div
              style={{
                fontSize: 12,
                color: color.labelAlternative,
                lineHeight: 1.6,
                padding: "8px 12px",
                background: color.fillNormal,
                borderRadius: radius.sm,
                marginBottom: 14,
              }}
            >
              💡 Google Meet 하단의 <b>CC</b> 버튼 또는 단축키 <b>c</b>로 자막을
              켤 수 있습니다.
            </div>
          )}

          <DangerButton onClick={handleEndMeeting}>
            회의 종료 및 AI 요약 시작
          </DangerButton>
          <button
            onClick={handleAbortCapture}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "9px 0",
              background: "none",
              border: `1px solid ${color.lineNeutral}`,
              borderRadius: radius.sm,
              fontSize: 13,
              color: color.labelAlternative,
              cursor: "pointer",
            }}
          >
            수집 중단 (저장 안 함)
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 14 }}>
          {/* 비활성 상태 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color.labelAssistive,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: color.labelAlternative,
              }}
            >
              대기 중
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: color.labelAlternative,
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            FlowMeet 회의와 연결하면 Google Meet의 자막을 자동으로 저장합니다.
          </p>
          <PrimaryButton onClick={() => setView("setup")}>
            회의 연결하기
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

// ── 내부 컴포넌트 ─────────────────────────────────────────────

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "4px 0",
        fontSize: 13,
      }}
    >
      <span style={{ color: color.labelAlternative }}>{label}</span>
      <span style={{ fontWeight: 600, color: color.labelNormal }}>{value}</span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{ height: 1, background: color.lineNeutral, margin: "0 -20px" }}
    />
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 8,
        fontSize: 12,
        color: color.negative,
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: color.labelNeutral,
  marginBottom: 5,
  marginTop: 14,
};

function SelectBox({
  children,
  style,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode;
}) {
  return (
    <select
      {...rest}
      style={{
        width: "100%",
        padding: "9px 12px",
        border: `1px solid ${color.lineNormal}`,
        borderRadius: radius.sm,
        fontSize: 13,
        color: rest.disabled ? color.labelAssistive : color.labelNormal,
        background: color.bgNormal,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        outline: "none",
        ...style,
      }}
    >
      {children}
    </select>
  );
}
