import { useState } from "react";
import { apiFetch } from "../../api/client";
import { storage } from "../../utils/storage";
import { color, radius } from "../tokens";
import type { UserData } from "../../types";

interface Props {
  onLogin: (user: UserData) => void;
}

export function LoginView({ onLogin }: Props) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openWebApp = () =>
    chrome.tabs.create({ url: "https://app.flowmeet.kr" });

  const checkLogin = async () => {
    setChecking(true);
    setError(null);
    try {
      const { accessToken } = await chrome.storage.local.get(["accessToken"]);
      if (!accessToken) {
        setError(
          "아직 로그인이 감지되지 않았습니다.\n웹앱에서 로그인 후 다시 눌러주세요.",
        );
        return;
      }
      const res = await apiFetch<{ email?: string; nickname?: string }>(
        "/v1/users/me",
      );
      if (!res.data?.email) {
        setError("사용자 정보를 불러오지 못했습니다. 다시 시도해주세요.");
        return;
      }
      const user: UserData = {
        email: res.data.email,
        nickname: res.data.nickname ?? res.data.email.split("@")[0],
      };
      await storage.set({ user });
      onLogin(user);
    } catch {
      setError("확인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ padding: "24px 20px" }}>
      {/* 로고 */}
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <FlowMeetLogo />
        <p
          style={{
            fontSize: 13,
            color: color.labelAlternative,
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          Google Meet 회의 자막을 자동으로 저장합니다
        </p>
      </div>

      {/* 안내 카드 */}
      <div
        style={{
          background: color.primaryBg,
          border: `1px solid rgba(0,102,255,0.15)`,
          borderRadius: radius.md,
          padding: "12px 14px",
          marginBottom: 16,
          fontSize: 13,
          color: color.primary,
          lineHeight: 1.8,
        }}
      >
        <span style={{ fontWeight: 600 }}>① </span>아래 버튼으로 웹앱 열기
        <br />
        <span style={{ fontWeight: 600 }}>② </span>FlowMeet에 로그인
        <br />
        <span style={{ fontWeight: 600 }}>③ </span>이 팝업으로 돌아와
        &ldquo;로그인 확인&rdquo; 클릭
      </div>

      <PrimaryButton onClick={openWebApp} style={{ marginBottom: 8 }}>
        FlowMeet 웹앱 열기
      </PrimaryButton>

      <OutlineButton onClick={checkLogin} disabled={checking}>
        {checking ? "확인 중…" : "로그인 확인"}
      </OutlineButton>

      {error && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 12px",
            background: color.cautionaryBg,
            border: `1px solid rgba(255,146,0,0.25)`,
            borderRadius: radius.sm,
            color: "#A05C00",
            fontSize: 12,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

// ── 공통 UI 컴포넌트 ──────────────────────────────────────────

export function FlowMeetLogo() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect width="22" height="22" rx="6" fill={color.primary} />
        <path
          d="M6 11h10M6 7h7M6 15h4"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: color.labelNormal,
          letterSpacing: "-0.4px",
        }}
      >
        FlowMeet
      </span>
    </div>
  );
}

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function PrimaryButton({ children, style, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      style={{
        width: "100%",
        padding: "10px 16px",
        border: "none",
        borderRadius: radius.md,
        background: rest.disabled ? color.labelAssistive : color.primary,
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, style, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      style={{
        width: "100%",
        padding: "10px 16px",
        border: `1px solid ${color.lineNormal}`,
        borderRadius: radius.md,
        background: rest.disabled ? color.bgAlternative : color.bgNormal,
        color: rest.disabled ? color.labelAssistive : color.labelNeutral,
        fontSize: 14,
        fontWeight: 500,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, style, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      style={{
        width: "100%",
        padding: "10px 16px",
        border: "none",
        borderRadius: radius.md,
        background: color.negative,
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
