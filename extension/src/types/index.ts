export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface UserData {
  email: string;
  nickname: string;
}

export interface MeetingContext {
  projectId: number;
  nodeId: number;
  meetingId: number;
}

export interface StorageData {
  accessToken?: string;
  refreshToken?: string;
  user?: UserData;
  meetingContext?: MeetingContext;
  pendingCaptions?: string[];
  isCapturing?: boolean;
  lastSentAt?: number;
  captionCount?: number;
}

export interface StatusResponse {
  isCapturing: boolean;
  captionCount: number;
  pendingCount: number;
  lastSentAt: number | null;
  meetingContext: MeetingContext | null;
  user: UserData | null;
}

export interface ApiResponse<T = unknown> {
  status: number;
  code: string;
  message: string;
  data: T | null;
}

export interface ProjectSummary {
  projectId: number;
  name: string;
}

export interface NodeSummary {
  nodeId: number;
  title: string;
  meetingId: number;
}

export interface MeetingDetail {
  meetingId: number;
  meetingUrl?: string;
  status?: "SCHEDULED" | "IN_PROGRESS" | "ENDED";
}

// chrome.runtime.sendMessage 메시지 타입
export type Message =
  | { type: "CAPTIONS_CAPTURED"; captions: string[] }
  | { type: "MEETING_ENDED" }
  | { type: "MEETING_STARTED" }
  | { type: "GET_STATUS" }
  | { type: "SET_MEETING_CONTEXT"; context: MeetingContext }
  | { type: "START_CAPTURE" }
  | { type: "STOP_CAPTURE" }
  | { type: "ABORT_CAPTURE" }
  | {
      type: "SYNC_TOKENS";
      accessToken: string | null;
      refreshToken: string | null;
    }
  | { type: "LOGOUT" };
