/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** 회의 수정 요청 */
export interface UpdateMeetingRequest {
  /**
   * 회의 시작 시각 (날짜+시간)
   * @format date-time
   * @example "2026-05-20T15:30:00"
   */
  startedAt: string;
  /**
   * 참여자 사용자 ID 목록
   * @minItems 1
   * @example [10,20,30]
   */
  participantUserIds: number[];
  /** 알림 발송 여부 */
  isPushEnabled?: boolean;
}

/** 공통 응답 형식 */
export interface CommonResponseObject {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: any;
}

/** 이메일 인증 코드 발송 요청 */
export interface SendEmailVerificationRequest {
  /**
   * 인증할 이메일
   * @format email
   * @minLength 1
   * @example "flowmin@flowmeet.kr"
   */
  email: string;
}

/** 이메일 인증 코드 검증 요청 */
export interface VerifyEmailRequest {
  /**
   * 인증할 이메일
   * @format email
   * @minLength 1
   * @example "flowmin@flowmeet.kr"
   */
  email: string;
  /**
   * 인증 코드
   * @minLength 1
   * @example "123456"
   */
  code: string;
}

/** 프로젝트 생성 요청 */
export interface CreateProjectRequest {
  /**
   * 프로젝트 이름
   * @minLength 1
   * @example "FlowMeet 리뉴얼"
   */
  name: string;
}

/** 공통 응답 형식 */
export interface CommonResponseCreateProjectResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: CreateProjectResponse;
}

/** 프로젝트 생성 응답 */
export interface CreateProjectResponse {
  /**
   * 생성된 프로젝트 ID
   * @format int64
   * @example 17
   */
  projectId?: number;
  /**
   * 프로젝트 이름
   * @example "FlowMeet 리뉴얼"
   */
  name?: string;
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  createdAt?: string;
}

/** 프로젝트 URL 등록/수정 요청 */
export interface ProjectUrlRequest {
  /**
   * URL 이름(라벨)
   * @minLength 1
   * @example "GitHub 레포지토리"
   */
  name: string;
  /**
   * 프로젝트에 연결할 URL
   * @minLength 1
   * @example "https://github.com/kookmin-sw/2026-capstone-09"
   */
  url: string;
}

/** 공통 응답 형식 */
export interface CommonResponseProjectUrlResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: ProjectUrlResponse;
}

/** 프로젝트 URL 응답 */
export interface ProjectUrlResponse {
  /**
   * URL ID
   * @format int64
   * @example 3
   */
  urlId?: number;
  /**
   * URL 이름(라벨)
   * @example "GitHub 레포지토리"
   */
  name?: string;
  /**
   * URL 값
   * @example "https://github.com/kookmin-sw/2026-capstone-09"
   */
  url?: string;
}

/** 태그 생성 요청 */
export interface CreateTagRequest {
  /**
   * 태그 이름
   * @minLength 1
   * @example "긴급"
   */
  name: string;
  /**
   * 태그 색상
   * @example "RED"
   */
  color:
    | "NEUTRAL"
    | "RED"
    | "RED_ORANGE"
    | "ORANGE"
    | "LIME"
    | "GREEN"
    | "CYAN"
    | "LIGHT_BLUE"
    | "BLUE"
    | "VIOLET"
    | "PURPLE"
    | "PINK";
}

/** 노드 생성 요청 */
export interface CreateNodeRequest {
  /**
   * 노드 제목
   * @minLength 1
   * @example "로그인 화면 기획"
   */
  title: string;
  /**
   * 노드 설명
   * @example "OAuth2 로그인 플로우 정리"
   */
  description?: string;
  /**
   * 노드 유형
   * @example "MAIN"
   */
  type?: "MAIN" | "SUB";
  /**
   * 상위 노드 ID (루트인 경우 null)
   * @format int64
   * @example 100
   */
  parentId?: number;
}

/** 노드 태그 추가 요청 */
export interface AddNodeTagRequest {
  /**
   * 추가할 태그 ID
   * @format int64
   * @example 5
   */
  tagId: number;
}

/** 공통 응답 형식 */
export interface CommonResponseRequestNodeSummaryResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: RequestNodeSummaryResponse;
}

/** 메인 노드 요약 요청 응답 */
export interface RequestNodeSummaryResponse {
  /**
   * AI 요약 작업 ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  jobId?: string;
}

/** 회의 생성 요청 */
export interface CreateMeetingRequest {
  /**
   * 회의 시작 시각 (날짜+시간)
   * @format date-time
   * @example "2026-05-20T15:30:00"
   */
  startedAt: string;
  /**
   * 참여자 사용자 ID 목록
   * @minItems 1
   * @example [10,20,30]
   */
  participantUserIds: number[];
  /** 알림 발송 여부 */
  isPushEnabled?: boolean;
}

/** 자막 저장 요청 */
export interface AppendTranscriptRequest {
  /**
   * 자막 텍스트
   * @minLength 1
   * @example "플로우: 네, 다들 시간 맞춰주셔서 감사합니다."
   */
  content: string;
}

/** 노드 담당자 지정 요청 */
export interface CreateAssigneeRequest {
  /**
   * 담당자로 지정할 사용자 ID
   * @format int64
   * @example 91
   */
  userId: number;
}

/** 드래그 노드 분석 요청 */
export interface AnalyzeDraggedNodesRequest {
  /**
   * 분석할 노드 ID 목록 (최소 2개)
   * @maxItems 2147483647
   * @minItems 2
   * @example [1,2,3]
   */
  nodeIds: number[];
}

/** 후속 업무 담당자별 분배 현황 */
export interface ActionItemsAnalysisItem {
  /**
   * 전체 후속 업무 수
   * @format int32
   * @example 15
   */
  totalCount?: number;
  /** 담당자별 업무 배분 */
  byPerson?: Record<string, PersonAnalysisItem>;
}

/** 선택한 노드들의 회의록 기반 AI 분석 결과 */
export interface AnalyzeDraggedNodesResponse {
  /** 회의 간 연관 관계 (구체화, 시너지, 선행조건 등) */
  meetingRelationships?: MeetingRelationshipItem[];
  /** 회의에서 도출된 후속 업무의 담당자별 분배 현황 */
  actionItemsAnalysis?: ActionItemsAnalysisItem;
  /** 회의 내용 기반 AI 발전 아이디어 제안 (마크다운) */
  developmentIdeas?: string;
  /** 노트 내용 기반 AI 요약 */
  notesSummary?: string;
  /** 회의 관계 시각화 Mermaid 코드 */
  mermaidCode?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseAnalyzeDraggedNodesResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: AnalyzeDraggedNodesResponse;
}

/** 회의 간 연관 관계 */
export interface MeetingRelationshipItem {
  /**
   * 기준 회의 제목
   * @example "비즈니스 모델 전략 회의"
   */
  from?: string;
  /**
   * 연관 회의 제목
   * @example "MVP기능 회의"
   */
  to?: string;
  /**
   * 관계 유형 (구체화/변화 발생/시너지/선행조건/대체 가능/상충)
   * @example "구체화"
   */
  relation?: string;
  /** 해당 관계로 판단한 근거 */
  reason?: string;
}

/** 담당자별 업무 배분 */
export interface PersonAnalysisItem {
  /**
   * 배정된 업무 수
   * @format int32
   * @example 5
   */
  count?: number;
  /**
   * 전체 대비 담당 비율 (합산 = 1.0)
   * @format double
   * @example "0.33"
   */
  rate?: number;
}

/** 프로젝트 멤버 초대 요청 */
export interface InviteProjectMemberRequest {
  /**
   * 초대할 사용자 이메일
   * @format email
   * @minLength 1
   * @example "teammate@flowmeet.kr"
   */
  email: string;
}

/** 노드 간 엣지 생성 요청 */
export interface CreateEdgeRequest {
  /**
   * 엣지의 시작 노드 ID
   * @format int64
   * @example 101
   */
  startNodeId: number;
  /**
   * 엣지의 종료 노드 ID
   * @format int64
   * @example 102
   */
  endNodeId: number;
  /**
   * 엣지에 대한 설명
   * @example "로그인 성공 시 대시보드로 이동"
   */
  comment?: string;
}

/** 참조 노드 추가 요청 */
export interface AddChatNodeRequest {
  /**
   * 참조할 노드 ID
   * @format int64
   * @example 101
   */
  nodeId: number;
}

/** 참조 노드 추가 응답 */
export interface AddChatNodeResponse {
  /**
   * 채팅 세션 ID
   * @format int64
   * @example 301
   */
  chatSessionId?: number;
  /** 추가된 참조 노드 */
  referencedNode?: ReferencedNodeResponse;
}

/** 공통 응답 형식 */
export interface CommonResponseAddChatNodeResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: AddChatNodeResponse;
}

/** 참조 노드 정보 */
export interface ReferencedNodeResponse {
  /**
   * 노드 ID
   * @format int64
   * @example 101
   */
  nodeId?: number;
  /**
   * 노드 번호
   * @example "1.1"
   */
  number?: string;
  /**
   * 노드 제목
   * @example "기획 문서 작성"
   */
  title?: string;
}

/** 메시지 전송 요청 */
export interface SendMessageRequest {
  /**
   * 메시지 내용
   * @minLength 1
   * @example "이 노드 내용을 기반으로 일정을 정리해줘"
   */
  content: string;
  /**
   * 참조 노드 ID 목록
   * @example [1,2]
   */
  referenceNodeIds?: number[];
  /**
   * 참조 사용자 ID 목록
   * @example [3,4]
   */
  referenceUserIds?: number[];
}

/** 공통 응답 형식 */
export interface CommonResponseSendMessageResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: SendMessageResponse;
}

/** 메시지 전송 응답 */
export interface SendMessageResponse {
  /**
   * 메시지 ID
   * @format int64
   * @example 5001
   */
  messageId?: number;
  /** 메시지 내용 */
  content?: string;
  /**
   * 메시지 타입
   * @example "USER"
   */
  messageType?: "USER" | "AI_RESPONSE" | "AI_ACTION";
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-04-19T10:05:00"
   */
  createdAt?: string;
}

/** 새 채팅 시작 요청 */
export interface StartChatRequest {
  /**
   * 첫 메시지 내용
   * @minLength 1
   * @example "이 프로젝트 노드들을 정리해줘"
   */
  content: string;
  /**
   * 참조할 노드 ID 목록
   * @example [101,102]
   */
  nodeIds?: number[];
  /**
   * 참조 사용자 ID 목록
   * @example [3,4]
   */
  referenceUserIds?: number[];
}

/** 공통 응답 형식 */
export interface CommonResponseStartChatResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: StartChatResponse;
}

/** 새 채팅 시작 응답 */
export interface StartChatResponse {
  /**
   * 채팅 세션 ID
   * @format int64
   * @example 301
   */
  chatSessionId?: number;
  /**
   * AI가 생성한 채팅 제목
   * @example "프로젝트 노드 정리 요청"
   */
  title?: string;
  /** AI 응답 메시지 */
  aiResponse?: string;
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-04-19T10:00:00"
   */
  createdAt?: string;
}

/** 프로젝트 초대 수락 요청 */
export interface AcceptProjectInvitationRequest {
  /**
   * 초대 메일 링크에 포함된 JWT 토큰
   * @minLength 1
   */
  token: string;
}

/** 프로젝트 초대 수락 응답 */
export interface AcceptProjectInvitationResponse {
  /**
   * 수락한 프로젝트 ID
   * @format int64
   * @example 12
   */
  projectId?: number;
}

/** 공통 응답 형식 */
export interface CommonResponseAcceptProjectInvitationResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: AcceptProjectInvitationResponse;
}

/** 파일 업로드 완료 확인 요청 */
export interface ConfirmFileUploadRequest {
  /**
   * Presigned URL 발급 시 받은 파일 키
   * @minLength 1
   * @example "node/20260419/abc123-meeting-notes.pdf"
   */
  fileKey: string;
  /**
   * 원본 파일 이름
   * @minLength 1
   * @example "meeting-notes.pdf"
   */
  fileName: string;
  /**
   * 파일 크기(바이트)
   * @format int64
   * @example 204800
   */
  fileSize?: number;
  /**
   * 파일 확장자
   * @minLength 1
   * @example "pdf"
   */
  extension: string;
  /**
   * 콘텐츠 타입(MIME)
   * @minLength 1
   * @example "application/pdf"
   */
  contentType: string;
}

/** 공통 응답 형식 */
export interface CommonResponseFileInformationResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: FileInformationResponse;
}

/** 파일 정보 응답 */
export interface FileInformationResponse {
  /**
   * 파일 식별용 키
   * @example "node/20260419/abc123-meeting-notes.pdf"
   */
  fileKey?: string;
  /**
   * 원본 파일 이름
   * @example "meeting-notes.pdf"
   */
  name?: string;
  /**
   * 파일 확장자
   * @example "pdf"
   */
  extension?: string;
  /**
   * 파일 크기(바이트)
   * @format int64
   * @example 204800
   */
  size?: number;
  /**
   * 파일이 속한 도메인 타입
   * @example "NODE_ATTACHMENT"
   */
  domainType?:
    | "USER_PROFILE"
    | "PROJECT_IMAGE"
    | "NODE_ATTACHMENT"
    | "NODE_NOTE_IMAGE"
    | "MEETING_SUMMARY"
    | "CHAT_ATTACHMENT"
    | "TEMP";
  /**
   * 파일이 속한 엔티티 ID
   * @format int64
   * @example 128
   */
  entityId?: number;
  /**
   * 접근 가능한 최종 URL
   * @example "https://cdn.flowmeet.kr/node/20260419/abc123-meeting-notes.pdf"
   */
  uploadUrl?: string;
}

/** S3 업로드용 Presigned URL 발급 요청 */
export interface CreatePresignedUrlRequest {
  /**
   * 원본 파일 이름
   * @minLength 1
   * @example "meeting-notes.pdf"
   */
  fileName: string;
  /**
   * 파일 크기(바이트)
   * @format int64
   * @example 204800
   */
  fileSize?: number;
  /**
   * 콘텐츠 타입(MIME)
   * @minLength 1
   * @example "application/pdf"
   */
  contentType: string;
}

/** 공통 응답 형식 */
export interface CommonResponseCreatePresignedUrlResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: CreatePresignedUrlResponse;
}

/** Presigned URL 발급 응답 */
export interface CreatePresignedUrlResponse {
  /**
   * 파일 식별용 키
   * @example "node/20260419/abc123-meeting-notes.pdf"
   */
  fileKey?: string;
  /**
   * 업로드에 사용할 Presigned URL
   * @example "https://flowmeet-bucket.s3.amazonaws.com/node/20260419/abc123-meeting-notes.pdf?X-Amz-Signature=..."
   */
  presignedUrl?: string;
  /**
   * 업로드 완료 후 접근 가능한 최종 URL
   * @example "https://cdn.flowmeet.kr/node/20260419/abc123-meeting-notes.pdf"
   */
  uploadUrl?: string;
}

/** 회원가입 요청 */
export interface SignupRequest {
  /**
   * 소셜 제공자
   * @example "GOOGLE"
   */
  socialProvider: "GOOGLE" | "KAKAO";
  /**
   * 소셜 access token (로그인 응답으로 받은 값)
   * @minLength 1
   * @example "ya29.a0AfH6SMB..."
   */
  socialAccessToken: string;
  /**
   * 소셜 refresh token (로그인 응답으로 받은 값, 없으면 null)
   * @example "1//0gLY..."
   */
  socialRefreshToken?: string;
  /**
   * 닉네임(최대 20자)
   * @minLength 0
   * @maxLength 20
   * @example "수민"
   */
  nickname: string;
  /**
   * 이메일
   * @format email
   * @minLength 1
   * @example "tnals655@kookmin.ac.kr"
   */
  email: string;
}

/** 공통 응답 형식 */
export interface CommonResponseTokenResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: TokenResponse;
}

/** 토큰 응답 */
export interface TokenResponse {
  /**
   * Access Token
   * @example "eyJhbGciOiJIUzI1NiJ9..."
   */
  accessToken?: string;
  /**
   * Refresh Token
   * @example "eyJhbGciOiJIUzI1NiJ9..."
   */
  refreshToken?: string;
}

/** 회원가입 이메일 인증 코드 발송 요청 */
export interface SendAuthEmailVerificationRequest {
  /**
   * 인증할 이메일
   * @format email
   * @minLength 1
   * @example "flowmin@flowmeet.kr"
   */
  email: string;
}

/** 회원가입 이메일 인증 코드 검증 요청 */
export interface VerifyAuthEmailRequest {
  /**
   * 인증할 이메일
   * @format email
   * @minLength 1
   * @example "flowmin@flowmeet.kr"
   */
  email: string;
  /**
   * 인증 코드
   * @minLength 1
   * @example "123456"
   */
  code: string;
}

/** 토큰 갱신 요청 */
export interface RefreshTokenRequest {
  /**
   * Refresh Token
   * @minLength 1
   * @example "eyJhbGciOiJIUzI1NiJ9..."
   */
  refreshToken: string;
}

/** 소셜 로그인 요청 */
export interface SocialLoginRequest {
  /**
   * 소셜 로그인 인증 코드
   * @minLength 1
   * @example "4/0AX4XfWjLkLi..."
   */
  code: string;
  /**
   * SPA 측에서 사용한 redirect URI (provider 에 등록된 값과 동일해야 합니다)
   * @minLength 1
   * @example "https://app.flowmeet.kr/auth/callback"
   */
  redirectUri: string;
}

/** 내 정보 수정 요청 */
export interface UpdateUserRequest {
  /**
   * 닉네임(최대 20자)
   * @minLength 0
   * @maxLength 20
   * @example "플로우민"
   */
  nickname: string;
  /**
   * 이메일
   * @format email
   * @example "flowmin@flowmeet.kr"
   */
  email?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseUpdateUserResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: UpdateUserResponse;
}

/** 내 정보 수정 응답 */
export interface UpdateUserResponse {
  /**
   * 사용자 ID
   * @format int64
   * @example 91
   */
  userId?: number;
  /**
   * 이메일
   * @example "flowmin@flowmeet.kr"
   */
  email?: string;
  /**
   * 닉네임
   * @example "플로우민"
   */
  nickname?: string;
  /**
   * 프로필 이미지 URL
   * @example "https://cdn.flowmeet.kr/profile/91.png"
   */
  profileImageUrl?: string;
}

/** 프로젝트 수정 요청 */
export interface UpdateProjectRequest {
  /**
   * 변경할 프로젝트 이름
   * @minLength 1
   * @example "FlowMeet v2"
   */
  name: string;
}

/** 태그 수정 요청 */
export interface UpdateTagRequest {
  /**
   * 변경할 태그 이름
   * @minLength 1
   * @example "매우 긴급"
   */
  name: string;
  /**
   * 변경할 태그 색상
   * @example "RED"
   */
  color:
    | "NEUTRAL"
    | "RED"
    | "RED_ORANGE"
    | "ORANGE"
    | "LIME"
    | "GREEN"
    | "CYAN"
    | "LIGHT_BLUE"
    | "BLUE"
    | "VIOLET"
    | "PURPLE"
    | "PINK";
}

/** 프로젝트 알림 설정 수정 요청 */
export interface UpdateNotificationSettingRequest {
  /**
   * 회의 관련 알림 수신 여부
   * @example true
   */
  meetingEnabled?: boolean;
  /**
   * 노드 관련 알림 수신 여부
   * @example true
   */
  nodeEnabled?: boolean;
  /**
   * 데스크톱 푸시 알림 수신 여부
   * @example false
   */
  desktopEnabled?: boolean;
  /**
   * 이메일 알림 수신 여부
   * @example true
   */
  emailEnabled?: boolean;
}

/** 공통 응답 형식 */
export interface CommonResponseGetNotificationSettingResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetNotificationSettingResponse;
}

/** 프로젝트 알림 설정 조회 응답 */
export interface GetNotificationSettingResponse {
  /**
   * 프로젝트 ID
   * @format int64
   * @example 17
   */
  projectId?: number;
  /**
   * 회의 관련 알림 수신 여부
   * @example true
   */
  meetingEnabled?: boolean;
  /**
   * 노드 관련 알림 수신 여부
   * @example true
   */
  nodeEnabled?: boolean;
  /**
   * 데스크톱 푸시 알림 수신 여부
   * @example false
   */
  desktopEnabled?: boolean;
  /**
   * 이메일 알림 수신 여부
   * @example true
   */
  emailEnabled?: boolean;
}

/** 노드 제목 수정 요청 */
export interface UpdateNodeTitleRequest {
  /**
   * 변경할 제목
   * @minLength 1
   * @example "로그인 화면 기획 (v2)"
   */
  title: string;
}

/** 노드 상태 변경 요청 */
export interface UpdateNodeStatusRequest {
  /**
   * 변경할 노드 상태
   * @example "IN_PROGRESS"
   */
  status: "WAITING" | "IN_PROGRESS" | "ON_HOLD" | "DONE" | "CLOSED";
}

/** 노드 노트 수정 요청 */
export interface UpdateNodeNoteRequest {
  /**
   * 변경할 노트 내용(마크다운)
   * @example "## 로그인 시나리오
   * - Google OAuth ..."
   */
  noteContent?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseEndMeetingResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: EndMeetingResponse;
}

/** 회의 종료 응답 */
export interface EndMeetingResponse {
  /**
   * AI 요약 작업 ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  jobId?: string;
}

/** 칸반 카드 이동(드래그 앤 드롭) 요청 */
export interface UpdateNodeKanbanRequest {
  /**
   * 변경할 노드 상태
   * @example "IN_PROGRESS"
   */
  status: "WAITING" | "IN_PROGRESS" | "ON_HOLD" | "DONE" | "CLOSED";
  /**
   * 칸반 내 정렬 순서
   * @format int32
   * @example 1024
   */
  sortOrder: number;
}

/** 노드 설명 수정 요청 */
export interface UpdateNodeDescriptionRequest {
  /**
   * 변경할 설명
   * @example "OAuth2 로그인 플로우 정리 및 와이어프레임 첨부"
   */
  description?: string;
}

/** 프로젝트 멤버 권한 변경 요청 */
export interface UpdateProjectMemberRoleRequest {
  /**
   * 변경할 권한
   * @example "MEMBER"
   */
  role: "VIEWER" | "MEMBER" | "OWNER";
}

/** 채팅 제목 수정 요청 */
export interface UpdateChatSessionRequest {
  /**
   * 변경할 채팅 제목
   * @minLength 1
   * @example "수정된 채팅 제목"
   */
  title: string;
}

/** 공통 응답 형식 */
export interface CommonResponseUpdateChatSessionResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: UpdateChatSessionResponse;
}

/** 채팅 제목 수정 응답 */
export interface UpdateChatSessionResponse {
  /**
   * 채팅 세션 ID
   * @format int64
   * @example 301
   */
  chatSessionId?: number;
  /**
   * 변경된 채팅 제목
   * @example "수정된 채팅 제목"
   */
  title?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetUserResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetUserResponse;
}

/** 내 정보 조회 응답 */
export interface GetUserResponse {
  /**
   * 이메일
   * @example "flowmin@flowmeet.kr"
   */
  email?: string;
  /**
   * 닉네임
   * @example "플로우민"
   */
  nickname?: string;
  /**
   * 프로필 이미지 URL
   * @example "https://cdn.flowmeet.kr/profile/91.png"
   */
  profileImageUrl?: string;
  /**
   * 가입 시각
   * @format date-time
   * @example "2026-03-01T09:00:00"
   */
  createdAt?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseCursorSliceResponseProjectSummaryResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: CursorSliceResponseProjectSummaryResponse;
}

/** 커서 기반 페이지 응답 */
export interface CursorSliceResponseProjectSummaryResponse {
  /** 조회된 데이터 목록 */
  content?: ProjectSummaryResponse[];
  /**
   * 요청한 페이지 크기
   * @format int32
   * @example 20
   */
  size?: number;
  /**
   * 다음 페이지 존재 여부
   * @example true
   */
  hasNext?: boolean;
  /**
   * 다음 페이지 조회용 커서 ID
   * @format int64
   * @example 42
   */
  nextCursorId?: number;
  /**
   * 다음 페이지 조회용 커서 값(정렬 기준 값)
   * @example "2026-04-19T10:00:00"
   */
  nextCursorValue?: string;
}

/** 프로젝트 목록 요약 응답 */
export interface ProjectSummaryResponse {
  /**
   * 프로젝트 ID
   * @format int64
   * @example 17
   */
  projectId?: number;
  /**
   * 프로젝트 프로필 이미지 URL
   * @example "https://static.flowmeet.kr/projects/1.png"
   */
  profileImageUrl?: string;
  /**
   * 프로젝트 이름
   * @example "FlowMeet 리뉴얼"
   */
  name?: string;
  /**
   * 프로젝트 멤버 수
   * @format int32
   * @example 8
   */
  memberCount?: number;
  /**
   * 마지막 활동 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  lastActivityAt?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetProjectResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetProjectResponse;
}

/** 프로젝트 상세 조회 응답 */
export interface GetProjectResponse {
  /**
   * 프로젝트 ID
   * @format int64
   * @example 17
   */
  projectId?: number;
  /**
   * 프로젝트 이름
   * @example "FlowMeet 리뉴얼"
   */
  name?: string;
  /**
   * 프로젝트 프로필 이미지 URL
   * @example "https://static.flowmeet.kr/projects/1.png"
   */
  profileImageUrl?: string;
  /**
   * 내 권한
   * @example "OWNER"
   */
  myRole?: "VIEWER" | "MEMBER" | "OWNER";
  /**
   * 프로젝트 멤버 수
   * @format int32
   * @example 8
   */
  memberCount?: number;
  /** 프로젝트에 등록된 URL 목록 */
  urls?: UrlItem[];
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-03-01T09:00:00"
   */
  createdAt?: string;
  /**
   * 마지막 수정 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  updatedAt?: string;
}

/** 프로젝트에 등록된 URL 항목 */
export interface UrlItem {
  /**
   * URL ID
   * @format int64
   * @example 3
   */
  urlId?: number;
  /**
   * URL 이름(라벨)
   * @example "GitHub 레포지토리"
   */
  name?: string;
  /**
   * URL 값
   * @example "https://github.com/kookmin-sw/2026-capstone-09"
   */
  url?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetAllTagsResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetAllTagsResponse;
}

/** 프로젝트 태그 전체 조회 응답 */
export interface GetAllTagsResponse {
  /** 태그 목록 */
  tags?: TagItem[];
}

/** 태그 정보 */
export interface TagItem {
  /**
   * 태그 ID
   * @format int64
   * @example 5
   */
  tagId?: number;
  /**
   * 태그 이름
   * @example "긴급"
   */
  name?: string;
  /**
   * 태그 색상
   * @example "RED"
   */
  color?:
    | "NEUTRAL"
    | "RED"
    | "RED_ORANGE"
    | "ORANGE"
    | "LIME"
    | "GREEN"
    | "CYAN"
    | "LIGHT_BLUE"
    | "BLUE"
    | "VIOLET"
    | "PURPLE"
    | "PINK";
}

/** 공통 응답 형식 */
export interface CommonResponseSearchNodeResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: SearchNodeResponse;
}

/** 검색된 노드 항목 */
export interface SearchItem {
  /**
   * 노드 ID
   * @format int64
   * @example 101
   */
  nodeId?: number;
  /**
   * 노드 번호 (노드 1번의 서브 노드라면 1.1)
   * @example "1.1"
   */
  number?: string;
  /**
   * 노드 제목
   * @example "로그인 화면 기획"
   */
  title?: string;
  /**
   * 노드 설명
   * @example "OAuth2 로그인 플로우 정리"
   */
  description?: string;
  /**
   * 노드 상태
   * @example "IN_PROGRESS"
   */
  status?: "WAITING" | "IN_PROGRESS" | "ON_HOLD" | "DONE" | "CLOSED";
  /** 부여된 태그 목록 */
  tags?: TagItem[];
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-03-01T09:00:00"
   */
  createdAt?: string;
  /**
   * 마지막 수정 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  updatedAt?: string;
}

/** 노드 검색 응답 */
export interface SearchNodeResponse {
  /** 검색된 노드 목록 */
  nodes?: SearchItem[];
  /** @format int64 */
  totalCount?: number;
}

/** 노드 담당자 정보 */
export interface AssigneeItem {
  /**
   * 노드 담당자 ID
   * @format int64
   * @example 10
   */
  assigneeId?: number;
  /**
   * 사용자 ID
   * @format int64
   * @example 91
   */
  userId?: number;
  /**
   * 닉네임
   * @example "플로우민"
   */
  nickname?: string;
  /**
   * 이메일
   * @example "flowmin@flowmeet.kr"
   */
  email?: string;
  /**
   * 프로필 이미지 URL
   * @example "https://cdn.flowmeet.kr/profile/91.png"
   */
  profileImageUrl?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetFlowchartResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetFlowchartResponse;
}

/** 연결선 생성자 정보 */
export interface EdgeCreatorItem {
  /**
   * 사용자 ID
   * @format int64
   * @example 91
   */
  userId?: number;
  /**
   * 닉네임
   * @example "플로우민"
   */
  nickname?: string;
  /**
   * 이메일
   * @example "flowmin@flowmeet.kr"
   */
  email?: string;
  /**
   * 프로필 이미지 URL
   * @example "https://static.flowmeet.kr/profile/91.png"
   */
  profileImageUrl?: string;
}

/** 노드 간 연결선 항목 */
export interface EdgeItem {
  /**
   * 연결선 ID
   * @format int64
   * @example 9001
   */
  edgeId?: number;
  /**
   * 시작 노드 ID
   * @format int64
   * @example 101
   */
  startNodeId?: number;
  /**
   * 종료 노드 ID
   * @format int64
   * @example 102
   */
  endNodeId?: number;
  /** 연결선을 생성한 사용자 정보 */
  createdBy?: EdgeCreatorItem;
  /**
   * 연결선 설명
   * @example "로그인 성공 시 대시보드로 이동"
   */
  comment?: string;
  /**
   * 연결선 생성 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  createdAt?: string;
}

/** 플로우차트 조회 응답 (노드와 연결선) */
export interface GetFlowchartResponse {
  /** 노드 목록 */
  nodes?: NodeItem[];
  /** 노드 간 연결선 목록 */
  edges?: EdgeItem[];
}

/** 플로우차트의 노드 항목 */
export interface NodeItem {
  /**
   * 노드 ID
   * @format int64
   * @example 101
   */
  nodeId?: number;
  /**
   * 상위 노드 ID (메인인 경우 null)
   * @format int64
   * @example 100
   */
  parentId?: number;
  /**
   * 노드 번호 (노드 1번의 서브 노드라면 1.1)
   * @example "1.1"
   */
  number?: string;
  /**
   * 노드 제목
   * @example "로그인 화면 기획"
   */
  title?: string;
  /**
   * 노드 설명
   * @example "OAuth2 로그인 플로우 정리"
   */
  description?: string;
  /**
   * 노드 상태
   * @example "IN_PROGRESS"
   */
  status?: "WAITING" | "IN_PROGRESS" | "ON_HOLD" | "DONE" | "CLOSED";
  /**
   * 같은 상태 내 정렬 순서
   * @format int32
   * @example 1024
   */
  sortOrder?: number;
  /** 부여된 태그 목록 */
  tags?: TagItem[];
  /** 담당자 목록 */
  assignees?: AssigneeItem[];
  /**
   * 연결된 회의 존재 여부
   * @example true
   */
  hasMeeting?: boolean;
  /**
   * 하위 노드 ID 목록
   * @example [110,111]
   */
  childNodeIds?: number[];
  /**
   * 마지막 수정 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  updatedAt?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetNodeResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetNodeResponse;
}

/** 회의 생성자 */
export interface CreatorItem {
  /**
   * 사용자 ID
   * @format int64
   * @example 10
   */
  userId?: number;
  /**
   * 닉네임
   * @example "홍길동"
   */
  nickname?: string;
}

/** 노드 상세 조회 응답 */
export interface GetNodeResponse {
  /**
   * 노드 ID
   * @format int64
   * @example 101
   */
  nodeId?: number;
  /**
   * 프로젝트 ID
   * @format int64
   * @example 17
   */
  projectId?: number;
  /**
   * 상위 노드 ID (루트인 경우 null)
   * @format int64
   * @example 100
   */
  parentId?: number;
  /**
   * 노드 번호 (노드 1번의 서브 노드라면 1.1)
   * @example "1.1"
   */
  number?: string;
  /**
   * 노드 제목
   * @example "로그인 화면 기획"
   */
  title?: string;
  /**
   * 노드 설명
   * @example "OAuth2 로그인 플로우 정리"
   */
  description?: string;
  /**
   * 노트 내용(마크다운)
   * @example "## 로그인 시나리오
   * - Google OAuth ..."
   */
  noteContent?: string;
  /**
   * 노드 상태
   * @example "IN_PROGRESS"
   */
  status?: "WAITING" | "IN_PROGRESS" | "ON_HOLD" | "DONE" | "CLOSED";
  /**
   * 같은 상태 내 정렬 순서
   * @format int32
   * @example 1024
   */
  sortOrder?: number;
  /** 부여된 태그 목록 */
  tags?: TagItem[];
  /** 담당자 목록 */
  assignees?: AssigneeItem[];
  /** 연결된 회의 정보 (없으면 null) */
  meeting?: MeetingItem;
  /** 하위 노드 회의록을 종합한 AI 요약 (메인 노드 전용, 서브 노드에서는 필드 자체가 생략됨) */
  mainSummary?: string;
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-03-01T09:00:00"
   */
  createdAt?: string;
  /**
   * 마지막 수정 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  updatedAt?: string;
}

/** 노드에 연결된 회의 정보 */
export interface MeetingItem {
  /**
   * 회의 ID
   * @format int64
   * @example 57
   */
  meetingId?: number;
  /**
   * 회의 상태
   * @example "SCHEDULED"
   */
  status?: "SCHEDULED" | "IN_PROGRESS" | "ENDED";
  /**
   * 회의 시작 시각
   * @format date-time
   * @example "2026-04-20T14:00:00"
   */
  startedAt?: string;
  /**
   * 회의 시작 푸시 알림 사용 여부
   * @example true
   */
  isPushEnabled?: boolean;
  /**
   * 푸시 알림 예약 시각
   * @format date-time
   * @example "2026-04-20T13:50:00"
   */
  pushNotifyAt?: string;
  /**
   * 화상 회의 링크
   * @example "https://meet.google.com/abc-defg-hij"
   */
  meetingUrl?: string;
  /** 회의록 AI 요약 (생성 전이라면 null) */
  summary?: string;
  /** Mermaid 다이어그램 코드 (생성 전이라면 null) */
  mermaidCode?: string;
  /** 참여자 목록 */
  participants?: ParticipantItem[];
  /** 회의 생성자 */
  createdBy?: CreatorItem;
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  createdAt?: string;
}

/** 회의 참여자 */
export interface ParticipantItem {
  /**
   * 회의 참여자 ID
   * @format int64
   * @example 1
   */
  meetingParticipantId?: number;
  /**
   * 사용자 ID
   * @format int64
   * @example 10
   */
  userId?: number;
  /**
   * 닉네임
   * @example "홍길동"
   */
  nickname?: string;
  /**
   * 이메일
   * @example "test@flowmeet.kr"
   */
  email?: string;
  /**
   * 프로필 이미지 URL
   * @example "https://cdn.flowmit.com/profiles/10.png"
   */
  profileImageUrl?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetLinkedNodesResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetLinkedNodesResponse;
}

/** 노드에 연결된 상대 노드 목록 조회 응답 */
export interface GetLinkedNodesResponse {
  /** 연결된 노드 목록 */
  linkedNodes?: LinkedNodeItem[];
}

/** 연결선을 만든 사용자 정보 */
export interface LinkCreatorItem {
  /**
   * 사용자 ID
   * @format int64
   * @example 91
   */
  userId?: number;
  /**
   * 닉네임
   * @example "윤신지"
   */
  nickname?: string;
  /**
   * 프로필 이미지 URL
   * @example "https://cdn.flowmeet.kr/profile/91.png"
   */
  profileImageUrl?: string;
}

/** 연결된 상대 노드 항목 */
export interface LinkedNodeItem {
  /**
   * 연결선 ID
   * @format int64
   * @example 9001
   */
  edgeId?: number;
  /**
   * 조회한 노드의 연결선 내 역할
   * @example "START"
   */
  linkType?: "START" | "END";
  /**
   * 연결된 상대 노드 ID
   * @format int64
   * @example 102
   */
  linkedNodeId?: number;
  /**
   * 노드 번호 (노드 1번의 서브 노드라면 1.1)
   * @example "1"
   */
  number?: string;
  /**
   * 노드 제목
   * @example "메인 노드 제목입니다."
   */
  title?: string;
  /**
   * 노드 설명
   * @example "노드 노트 요약 내용입니다."
   */
  description?: string;
  /**
   * 연결선 코멘트
   * @example "로그인 성공 시 대시보드로 이동"
   */
  comment?: string;
  /** 연결선을 만든 사용자 정보 */
  createdBy?: LinkCreatorItem;
  /**
   * 연결선 생성 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  createdAt?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetNodeListResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetNodeListResponse;
}

/** 노드 목록 조회 응답 */
export interface GetNodeListResponse {
  /** 노드 목록 */
  nodes?: NodeListItem[];
}

/** 노드 목록의 개별 항목 */
export interface NodeListItem {
  /**
   * 노드 ID
   * @format int64
   * @example 101
   */
  nodeId?: number;
  /**
   * 노드 번호 (노드 1번의 서브 노드라면 1.1)
   * @example "1.1"
   */
  number?: string;
  /**
   * 노드 제목
   * @example "로그인 화면 기획"
   */
  title?: string;
  /**
   * 노드 설명
   * @example "OAuth2 로그인 플로우 정리"
   */
  description?: string;
  /**
   * 노드 상태
   * @example "IN_PROGRESS"
   */
  status?: "WAITING" | "IN_PROGRESS" | "ON_HOLD" | "DONE" | "CLOSED";
  /** 부여된 태그 목록 */
  tags?: TagItem[];
  /** 담당자 목록 */
  assignees?: AssigneeItem[];
  /**
   * 연결된 회의 존재 여부
   * @example true
   */
  hasMeeting?: boolean;
  /**
   * 마지막 수정 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  updatedAt?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetKanbanResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetKanbanResponse;
}

/** 칸반 보드 조회 응답 (상태별 그룹핑) */
export interface GetKanbanResponse {
  /** 대기 상태의 노드 목록 */
  waiting?: KanbanItem[];
  /** 진행 중 상태의 노드 목록 */
  inProgress?: KanbanItem[];
  /** 보류 상태의 노드 목록 */
  onHold?: KanbanItem[];
  /** 완료 상태의 노드 목록 */
  done?: KanbanItem[];
  /** 종료 상태의 노드 목록 */
  closed?: KanbanItem[];
}

/** 칸반 보드의 개별 노드 카드 */
export interface KanbanItem {
  /**
   * 노드 ID
   * @format int64
   * @example 101
   */
  nodeId?: number;
  /**
   * 노드 번호 (노드 1번의 서브 노드라면 1.1)
   * @example "1.1"
   */
  number?: string;
  /**
   * 노드 제목
   * @example "로그인 화면 기획"
   */
  title?: string;
  /**
   * 같은 상태 내 정렬 순서
   * @format int32
   * @example 1024
   */
  sortOrder?: number;
  /** 부여된 태그 목록 */
  tags?: TagItem[];
  /** 담당자 목록 */
  assignees?: AssigneeItem[];
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-03-01T09:00:00"
   */
  createdAt?: string;
  /**
   * 마지막 수정 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  updatedAt?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetAllProjectMembersResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetAllProjectMembersResponse;
}

/** 프로젝트 멤버 전체 조회 응답 */
export interface GetAllProjectMembersResponse {
  /** 프로젝트 멤버 목록 */
  members?: ProjectMemberInfo[];
}

/** 프로젝트 멤버 정보 */
export interface ProjectMemberInfo {
  /**
   * 프로젝트 멤버 ID
   * @format int64
   * @example 42
   */
  memberId?: number;
  /**
   * 사용자 ID
   * @format int64
   * @example 91
   */
  userId?: number;
  /**
   * 닉네임
   * @example "플로우민"
   */
  nickname?: string;
  /**
   * 이메일
   * @example "flowmin@flowmeet.kr"
   */
  email?: string;
  /**
   * 프로필 이미지 URL
   * @example "https://cdn.flowmeet.kr/profile/91.png"
   */
  profileImageUrl?: string;
  /**
   * 프로젝트 내 권한
   * @example "MEMBER"
   */
  role?: "VIEWER" | "MEMBER" | "OWNER";
}

/** 공통 응답 형식 */
export interface CommonResponseGetEdgesResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetEdgesResponse;
}

/** 엣지 목록 조회 응답 */
export interface GetEdgesResponse {
  /** 연결선 목록 */
  edges?: EdgeItem[];
}

/** 채팅 세션 요약 응답 */
export interface ChatSessionSummaryResponse {
  /**
   * 채팅 세션 ID
   * @format int64
   * @example 301
   */
  chatSessionId?: number;
  /**
   * 채팅 제목
   * @example "기획 문서 피드백 요청"
   */
  title?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseCursorSliceResponseChatSessionSummaryResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: CursorSliceResponseChatSessionSummaryResponse;
}

/** 커서 기반 페이지 응답 */
export interface CursorSliceResponseChatSessionSummaryResponse {
  /** 조회된 데이터 목록 */
  content?: ChatSessionSummaryResponse[];
  /**
   * 요청한 페이지 크기
   * @format int32
   * @example 20
   */
  size?: number;
  /**
   * 다음 페이지 존재 여부
   * @example true
   */
  hasNext?: boolean;
  /**
   * 다음 페이지 조회용 커서 ID
   * @format int64
   * @example 42
   */
  nextCursorId?: number;
  /**
   * 다음 페이지 조회용 커서 값(정렬 기준 값)
   * @example "2026-04-19T10:00:00"
   */
  nextCursorValue?: string;
}

/** 채팅 메시지 응답 */
export interface ChatMessageResponse {
  /**
   * 메시지 ID
   * @format int64
   * @example 5001
   */
  messageId?: number;
  /** 메시지 내용 */
  content?: string;
  /**
   * 메시지 타입
   * @example "USER"
   */
  messageType?: "USER" | "AI_RESPONSE" | "AI_ACTION";
  /** 액션 데이터 (AI_ACTION 타입만) */
  actionData?: string;
  /**
   * 생성 시각
   * @format date-time
   * @example "2026-04-19T10:01:00"
   */
  createdAt?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetChatSessionResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetChatSessionResponse;
}

/** 채팅 상세 조회 응답 */
export interface GetChatSessionResponse {
  /**
   * 채팅 세션 ID
   * @format int64
   * @example 301
   */
  chatSessionId?: number;
  /**
   * 채팅 제목
   * @example "기획 문서 피드백 요청"
   */
  title?: string;
  /** 참조 노드 목록 */
  referencedNodes?: ReferencedNodeResponse[];
  /** 메시지 목록 */
  messages?: ChatMessageResponse[];
  /**
   * 다음 페이지 존재 여부
   * @example false
   */
  hasNext?: boolean;
}

/** 공통 응답 형식 */
export interface CommonResponseGetReferenceUsersResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetReferenceUsersResponse;
}

/** 참조 가능한 사용자 목록 응답 */
export interface GetReferenceUsersResponse {
  /** 사용자 목록 */
  users?: ReferencedUserResponse[];
}

/** 참조 사용자 정보 */
export interface ReferencedUserResponse {
  /**
   * 사용자 ID
   * @format int64
   * @example 1
   */
  userId?: number;
  /**
   * 닉네임
   * @example "홍길동"
   */
  nickname?: string;
  /**
   * 프로필 이미지 URL
   * @example "https://example.com/profile.png"
   */
  profileImageUrl?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetReferenceNodesResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetReferenceNodesResponse;
}

/** 참조 가능한 노드 목록 응답 */
export interface GetReferenceNodesResponse {
  /** 노드 목록 */
  nodes?: ReferencedNodeResponse[];
}

/** 공통 응답 형식 */
export interface CommonResponseCursorSliceResponseNotificationSummaryResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: CursorSliceResponseNotificationSummaryResponse;
}

/** 커서 기반 페이지 응답 */
export interface CursorSliceResponseNotificationSummaryResponse {
  /** 조회된 데이터 목록 */
  content?: NotificationSummaryResponse[];
  /**
   * 요청한 페이지 크기
   * @format int32
   * @example 20
   */
  size?: number;
  /**
   * 다음 페이지 존재 여부
   * @example true
   */
  hasNext?: boolean;
  /**
   * 다음 페이지 조회용 커서 ID
   * @format int64
   * @example 42
   */
  nextCursorId?: number;
  /**
   * 다음 페이지 조회용 커서 값(정렬 기준 값)
   * @example "2026-04-19T10:00:00"
   */
  nextCursorValue?: string;
}

/** 알림 요약 응답 */
export interface NotificationSummaryResponse {
  /**
   * 알림 ID
   * @format int64
   * @example 4821
   */
  notificationId?: number;
  /**
   * 알림 유형
   * @example "MEETING_CREATED"
   */
  type?:
    | "MEETING_CREATED"
    | "MEETING_INVITE"
    | "MEETING_REMINDER"
    | "MEETING_ENDED"
    | "MEMBER_INVITE"
    | "NODE_ASSIGNED"
    | "NODE_UPDATED";
  /**
   * 알림 제목
   * @example "새 회의"
   */
  title?: string;
  /**
   * 알림 본문
   * @example "FlowMeet 프로젝트에 새 회의가 만들어졌어요"
   */
  content?: string;
  /**
   * 관련 프로젝트 ID
   * @format int64
   * @example 17
   */
  projectId?: number;
  /**
   * 관련 프로젝트 이름
   * @example "FlowMeet"
   */
  projectName?: string;
  /**
   * 알림 대상 ID
   * @format int64
   * @example 128
   */
  targetId?: number;
  /**
   * 읽음 여부
   * @example false
   */
  isRead?: boolean;
  /**
   * 알림 생성 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  createdAt?: string;
}

/** 공통 응답 형식 */
export interface CommonResponseGetUnreadCountResponse {
  /**
   * HTTP 상태 코드
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * 응답 코드
   * @example "OK"
   */
  code?: string;
  /**
   * 응답 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  data?: GetUnreadCountResponse;
}

/** 읽지 않은 알림 개수 응답 */
export interface GetUnreadCountResponse {
  /**
   * 읽지 않은 알림 개수
   * @format int64
   * @example 5
   */
  unreadCount?: number;
}

export interface SseEmitter {
  /** @format int64 */
  timeout?: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.flowmeet.kr";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title FlowMeet API
 * @version v1
 * @baseUrl https://api.flowmeet.kr
 *
 * FlowMeet 프로젝트 관리 및 회의 지원 서비스 API
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  meeting = {
    /**
     * @description 회의 시작 시간과 참여자를 수정합니다.
     *
     * @tags Meeting
     * @name UpdateMeeting
     * @summary 회의 수정
     * @request PUT:/v1/projects/{projectId}/nodes/{nodeId}/meetings/{meetingId}
     * @secure
     */
    updateMeeting: (
      projectId: number,
      nodeId: number,
      meetingId: number,
      data: UpdateMeetingRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_MEETING"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "회의 정보를 수정했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/meetings/${meetingId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 회의를 삭제합니다. 발급된 화상 회의 링크도 함께 정리합니다.
     *
     * @tags Meeting
     * @name DeleteMeeting
     * @summary 회의 삭제
     * @request DELETE:/v1/projects/{projectId}/nodes/{nodeId}/meetings/{meetingId}
     * @secure
     */
    deleteMeeting: (
      projectId: number,
      nodeId: number,
      meetingId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_MEETING"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "회의를 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/meetings/${meetingId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description 노드에 회의를 생성합니다. 화상 회의 링크를 함께 발급합니다.
     *
     * @tags Meeting
     * @name CreateMeeting
     * @summary 회의 생성
     * @request POST:/v1/projects/{projectId}/nodes/{nodeId}/meetings
     * @secure
     */
    createMeeting: (
      projectId: number,
      nodeId: number,
      data: CreateMeetingRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "CREATE_MEETING"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "회의를 만들었어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/meetings`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 회의 중 자막 텍스트를 저장합니다. 프론트 익스텐션이 주기적으로 호출합니다.
     *
     * @tags Meeting
     * @name AppendTranscript
     * @summary 자막 저장
     * @request POST:/v1/projects/{projectId}/nodes/{nodeId}/meetings/{meetingId}/transcripts
     * @secure
     */
    appendTranscript: (
      projectId: number,
      nodeId: number,
      meetingId: number,
      data: AppendTranscriptRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "APPEND_TRANSCRIPT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "자막을 저장했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/meetings/${meetingId}/transcripts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 회의를 종료하고 자막을 기반으로 AI 요약을 자동 요청합니다.
     *
     * @tags Meeting
     * @name EndMeeting
     * @summary 회의 종료
     * @request PATCH:/v1/projects/{projectId}/nodes/{nodeId}/meetings/{meetingId}/end
     * @secure
     */
    endMeeting: (
      projectId: number,
      nodeId: number,
      meetingId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "END_MEETING"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "회의를 종료했어요."
           */
          message?: object;
          /** 회의 종료 응답 */
          data?: EndMeetingResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/meetings/${meetingId}/end`,
        method: "PATCH",
        secure: true,
        ...params,
      }),
  };
  user = {
    /**
     * @description 변경할 이메일 주소로 6자리 인증 코드를 발송합니다. 코드 유효시간은 5분입니다.
     *
     * @tags User
     * @name SendEmailVerification
     * @summary 이메일 인증 코드 발송
     * @request POST:/v1/users/me/email-verifications
     * @secure
     */
    sendEmailVerification: (
      data: SendEmailVerificationRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "SEND_EMAIL_VERIFICATION"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "인증 코드를 보냈어요. 메일함을 확인해 주세요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/users/me/email-verifications`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 발송된 인증 코드로 이메일 소유를 확인합니다.
     *
     * @tags User
     * @name VerifyEmail
     * @summary 이메일 인증 코드 검증
     * @request POST:/v1/users/me/email-verifications/verify
     * @secure
     */
    verifyEmail: (data: VerifyEmailRequest, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "VERIFY_EMAIL"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "이메일 인증에 성공했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/users/me/email-verifications/verify`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name GetMe
     * @summary 내 정보 조회
     * @request GET:/v1/users/me
     * @secure
     */
    getMe: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_ME"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "내 정보를 조회했어요."
           */
          message?: object;
          /** 내 정보 조회 응답 */
          data?: GetUserResponse;
        },
        any
      >({
        path: `/v1/users/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 소유 중인 프로젝트가 있으면 탈퇴할 수 없습니다.
     *
     * @tags User
     * @name DeleteMe
     * @summary 회원 탈퇴
     * @request DELETE:/v1/users/me
     * @secure
     */
    deleteMe: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_ME"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "회원 탈퇴가 완료됐어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/users/me`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description 이메일을 변경할 때는 인증 코드 검증이 끝난 이메일만 사용할 수 있습니다.
     *
     * @tags User
     * @name UpdateMe
     * @summary 내 정보 수정
     * @request PATCH:/v1/users/me
     * @secure
     */
    updateMe: (data: UpdateUserRequest, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_ME"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "내 정보를 수정했어요."
           */
          message?: object;
          /** 내 정보 수정 응답 */
          data?: UpdateUserResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/users/me`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description png, jpeg, webp만 허용 (최대 5MB)
     *
     * @tags User
     * @name UpdateProfileImage
     * @summary 프로필 이미지 변경
     * @request PATCH:/v1/users/me/profile-image
     * @secure
     */
    updateProfileImage: (
      data: {
        /** @format binary */
        profileImage: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_PROFILE_IMAGE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로필 이미지를 변경했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/users/me/profile-image`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  project = {
    /**
     * @description 검색어, 정렬(LATEST/NAME), 커서 기반 슬라이싱을 지원합니다. 첫 요청은 cursorId/cursorValue 생략, 이후 응답의 nextCursorId/nextCursorValue를 그대로 전달합니다.
     *
     * @tags Project
     * @name GetAllProjects
     * @summary 프로젝트 목록 조회
     * @request GET:/v1/projects
     * @secure
     */
    getAllProjects: (
      query?: {
        search?: string;
        /** @default "LATEST" */
        sort?: "LATEST" | "NAME";
        /** @format int64 */
        cursorId?: number;
        cursorValue?: string;
        /**
         * @format int32
         * @default 20
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_ALL_PROJECTS"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로젝트 목록을 조회했어요."
           */
          message?: object;
          /** 커서 기반 페이지 응답 */
          data?: CursorSliceResponseProjectSummaryResponse;
        },
        any
      >({
        path: `/v1/projects`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name CreateProject
     * @summary 프로젝트 생성
     * @request POST:/v1/projects
     * @secure
     */
    createProject: (data: CreateProjectRequest, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "CREATE_PROJECT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로젝트를 생성했어요."
           */
          message?: object;
          /** 프로젝트 생성 응답 */
          data?: CreateProjectResponse;
        },
        any
      >({
        path: `/v1/projects`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 초대받는 이메일로 초대 링크가 포함된 메일을 전송합니다.
     *
     * @tags Project
     * @name InviteMember
     * @summary 프로젝트 멤버 초대
     * @request POST:/v1/projects/{projectId}/invite
     * @secure
     */
    inviteMember: (
      projectId: number,
      data: InviteProjectMemberRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "INVITE_MEMBER"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "멤버 초대 메일을 전송했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/invite`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 메일 링크의 JWT 토큰을 제출하면 해당 프로젝트에 VIEWER로 합류합니다.
     *
     * @tags Project
     * @name AcceptInvitation
     * @summary 프로젝트 초대 수락
     * @request POST:/v1/projects/invitations/accept
     * @secure
     */
    acceptInvitation: (
      data: AcceptProjectInvitationRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "ACCEPT_INVITATION"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로젝트에 합류했어요."
           */
          message?: object;
          /** 프로젝트 초대 수락 응답 */
          data?: AcceptProjectInvitationResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/invitations/accept`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name GetProject
     * @summary 프로젝트 상세 조회
     * @request GET:/v1/projects/{projectId}
     * @secure
     */
    getProject: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_PROJECT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로젝트를 조회했어요."
           */
          message?: object;
          /** 프로젝트 상세 조회 응답 */
          data?: GetProjectResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description OWNER만 삭제할 수 있습니다.
     *
     * @tags Project
     * @name DeleteProject
     * @summary 프로젝트 삭제
     * @request DELETE:/v1/projects/{projectId}
     * @secure
     */
    deleteProject: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_PROJECT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로젝트를 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        any
      >({
        path: `/v1/projects/${projectId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name UpdateProject
     * @summary 프로젝트 수정
     * @request PATCH:/v1/projects/{projectId}
     * @secure
     */
    updateProject: (
      projectId: number,
      data: UpdateProjectRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_PROJECT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로젝트를 수정했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description png, jpeg, webp만 허용 (최대 5MB)
     *
     * @tags Project
     * @name UpdateProfileImage1
     * @summary 프로젝트 이미지 변경
     * @request PATCH:/v1/projects/{projectId}/profile-image
     * @secure
     */
    updateProfileImage1: (
      projectId: number,
      data: {
        /** @format binary */
        profileImage: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_PROFILE_IMAGE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로젝트 이미지를 변경했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/profile-image`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  projectUrl = {
    /**
     * No description
     *
     * @tags ProjectUrl
     * @name AddUrl
     * @summary URL 추가
     * @request POST:/v1/projects/{projectId}/urls
     * @secure
     */
    addUrl: (
      projectId: number,
      data: ProjectUrlRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "ADD_URL"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "URL을 추가했어요."
           */
          message?: object;
          /** 프로젝트 URL 응답 */
          data?: ProjectUrlResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/urls`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectUrl
     * @name DeleteUrl
     * @summary URL 삭제
     * @request DELETE:/v1/projects/{projectId}/urls/{urlId}
     * @secure
     */
    deleteUrl: (projectId: number, urlId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_URL"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "URL을 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/urls/${urlId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectUrl
     * @name UpdateUrl
     * @summary URL 수정
     * @request PATCH:/v1/projects/{projectId}/urls/{urlId}
     * @secure
     */
    updateUrl: (
      projectId: number,
      urlId: number,
      data: ProjectUrlRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_URL"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "URL을 수정했어요."
           */
          message?: object;
          /** 프로젝트 URL 응답 */
          data?: ProjectUrlResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/urls/${urlId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  tag = {
    /**
     * @description 프로젝트의 전체 태그 목록을 조회합니다.
     *
     * @tags Tag
     * @name GetAllTags
     * @summary 태그 목록 조회
     * @request GET:/v1/projects/{projectId}/tags
     * @secure
     */
    getAllTags: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_ALL_TAGS"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "태그 목록을 조회했어요."
           */
          message?: object;
          /** 프로젝트 태그 전체 조회 응답 */
          data?: GetAllTagsResponse;
        },
        any
      >({
        path: `/v1/projects/${projectId}/tags`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 새 태그를 생성합니다.
     *
     * @tags Tag
     * @name CreateTag
     * @summary 태그 생성
     * @request POST:/v1/projects/{projectId}/tags
     * @secure
     */
    createTag: (
      projectId: number,
      data: CreateTagRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "CREATE_TAG"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "태그를 생성했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/tags`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 노드에 기존 태그를 연결합니다.
     *
     * @tags Tag
     * @name AddNodeTag
     * @summary 노드에 태그 추가
     * @request POST:/v1/projects/{projectId}/nodes/{nodeId}/tags
     * @secure
     */
    addNodeTag: (
      projectId: number,
      nodeId: number,
      data: AddNodeTagRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "ADD_NODE_TAG"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드에 태그를 추가했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/tags`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 태그를 삭제합니다. 연결된 노드 태그도 함께 삭제됩니다.
     *
     * @tags Tag
     * @name DeleteTag
     * @summary 태그 삭제
     * @request DELETE:/v1/projects/{projectId}/tags/{tagId}
     * @secure
     */
    deleteTag: (projectId: number, tagId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_TAG"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "태그를 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/tags/${tagId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description 태그 이름 또는 색상을 수정합니다.
     *
     * @tags Tag
     * @name UpdateTag
     * @summary 태그 수정
     * @request PATCH:/v1/projects/{projectId}/tags/{tagId}
     * @secure
     */
    updateTag: (
      projectId: number,
      tagId: number,
      data: UpdateTagRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_TAG"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "태그를 수정했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/tags/${tagId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 노드에서 태그 연결을 해제합니다.
     *
     * @tags Tag
     * @name RemoveNodeTag
     * @summary 노드에서 태그 제거
     * @request DELETE:/v1/projects/{projectId}/nodes/{nodeId}/tags/{tagId}
     * @secure
     */
    removeNodeTag: (
      projectId: number,
      nodeId: number,
      tagId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "REMOVE_NODE_TAG"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드에서 태그를 제거했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        any
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/tags/${tagId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  node = {
    /**
     * @description 프로젝트의 전체 노드 트리 + 엣지를 조회합니다.
     *
     * @tags Node
     * @name GetFlowchart
     * @summary 플로우차트 조회
     * @request GET:/v1/projects/{projectId}/nodes
     * @secure
     */
    getFlowchart: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_FLOWCHART"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "플로우차트를 조회했어요."
           */
          message?: object;
          /** 플로우차트 조회 응답 (노드와 연결선) */
          data?: GetFlowchartResponse;
        },
        any
      >({
        path: `/v1/projects/${projectId}/nodes`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 메인 노드 또는 서브 노드를 추가합니다.
     *
     * @tags Node
     * @name CreateNode
     * @summary 노드 추가
     * @request POST:/v1/projects/{projectId}/nodes
     * @secure
     */
    createNode: (
      projectId: number,
      data: CreateNodeRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "CREATE_NODE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드를 추가했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 하위 노드의 회의록 요약을 종합하여 메인 노드 요약을 요청합니다.
     *
     * @tags Node
     * @name RequestNodeSummary
     * @summary 메인 노드 요약 요청
     * @request POST:/v1/projects/{projectId}/nodes/{nodeId}/summary
     * @secure
     */
    requestNodeSummary: (
      projectId: number,
      nodeId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "REQUEST_NODE_SUMMARY"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "메인 노드 요약을 요청했어요."
           */
          message?: object;
          /** 메인 노드 요약 요청 응답 */
          data?: RequestNodeSummaryResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/summary`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description 드래그로 선택한 노드들의 회의록을 기반으로 AI 분석을 수행합니다.
     *
     * @tags Node
     * @name AnalyzeDraggedNodes
     * @summary 드래그 노드 분석
     * @request POST:/v1/projects/{projectId}/nodes/analysis
     * @secure
     */
    analyzeDraggedNodes: (
      projectId: number,
      data: AnalyzeDraggedNodesRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "ANALYZE_DRAGGED_NODES"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "드래그 노드 분석을 완료했어요."
           */
          message?: object;
          /** 선택한 노드들의 회의록 기반 AI 분석 결과 */
          data?: AnalyzeDraggedNodesResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/analysis`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 노드의 제목만 수정합니다.
     *
     * @tags Node
     * @name UpdateNodeTitle
     * @summary 노드 제목 수정
     * @request PATCH:/v1/projects/{projectId}/nodes/{nodeId}/title
     * @secure
     */
    updateNodeTitle: (
      projectId: number,
      nodeId: number,
      data: UpdateNodeTitleRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_NODE_TITLE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드 제목을 수정했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/title`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 노드의 상태(WAITING/IN_PROGRESS/ON_HOLD/DONE/CLOSED)만 변경합니다.
     *
     * @tags Node
     * @name UpdateNodeStatus
     * @summary 노드 상태 변경
     * @request PATCH:/v1/projects/{projectId}/nodes/{nodeId}/status
     * @secure
     */
    updateNodeStatus: (
      projectId: number,
      nodeId: number,
      data: UpdateNodeStatusRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_NODE_STATUS"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드 상태를 변경했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/status`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 노드의 노트(마크다운)만 수정합니다.
     *
     * @tags Node
     * @name UpdateNodeNote
     * @summary 노드 노트 수정
     * @request PATCH:/v1/projects/{projectId}/nodes/{nodeId}/note
     * @secure
     */
    updateNodeNote: (
      projectId: number,
      nodeId: number,
      data: UpdateNodeNoteRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_NODE_NOTE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드 노트를 수정했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/note`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 드래그 & 드롭으로 상태와 순서를 동시에 변경합니다.
     *
     * @tags Node
     * @name UpdateNodeKanban
     * @summary 칸반 카드 이동
     * @request PATCH:/v1/projects/{projectId}/nodes/{nodeId}/kanban
     * @secure
     */
    updateNodeKanban: (
      projectId: number,
      nodeId: number,
      data: UpdateNodeKanbanRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_NODE_KANBAN"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "칸반 카드를 옮겼어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/kanban`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 노드의 설명만 수정합니다.
     *
     * @tags Node
     * @name UpdateNodeDescription
     * @summary 노드 설명 수정
     * @request PATCH:/v1/projects/{projectId}/nodes/{nodeId}/description
     * @secure
     */
    updateNodeDescription: (
      projectId: number,
      nodeId: number,
      data: UpdateNodeDescriptionRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_NODE_DESCRIPTION"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드 설명을 수정했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/description`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 노드 제목, 키워드로 검색합니다.
     *
     * @tags Node
     * @name Search
     * @summary 프로젝트 내 검색
     * @request GET:/v1/projects/{projectId}/search
     * @secure
     */
    search: (
      projectId: number,
      query: {
        query: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "SEARCH"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "검색을 완료했어요."
           */
          message?: object;
          /** 노드 검색 응답 */
          data?: SearchNodeResponse;
        },
        any
      >({
        path: `/v1/projects/${projectId}/search`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 노드 클릭 시 사이드바 상세 정보를 조회합니다.
     *
     * @tags Node
     * @name GetNode
     * @summary 노드 상세 조회
     * @request GET:/v1/projects/{projectId}/nodes/{nodeId}
     * @secure
     */
    getNode: (projectId: number, nodeId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_NODE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드를 조회했어요."
           */
          message?: object;
          /** 노드 상세 조회 응답 */
          data?: GetNodeResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 노드 삭제. 하위 서브 노드도 연쇄 삭제됩니다.
     *
     * @tags Node
     * @name DeleteNode
     * @summary 노드 삭제
     * @request DELETE:/v1/projects/{projectId}/nodes/{nodeId}
     * @secure
     */
    deleteNode: (
      projectId: number,
      nodeId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_NODE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드를 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description 노드와 연결선으로 이어진 상대 노드 목록을 조회합니다.
     *
     * @tags Node
     * @name GetLinkedNodes
     * @summary 연결된 노드 조회
     * @request GET:/v1/projects/{projectId}/nodes/{nodeId}/linked-nodes
     * @secure
     */
    getLinkedNodes: (
      projectId: number,
      nodeId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_LINKED_NODES"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "연결된 노드를 조회했어요."
           */
          message?: object;
          /** 노드에 연결된 상대 노드 목록 조회 응답 */
          data?: GetLinkedNodesResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/linked-nodes`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 노드를 리스트 형태로 조회합니다. (LATEST: 최신순, NAME: 가나다순)
     *
     * @tags Node
     * @name GetNodeList
     * @summary 리스트 뷰 조회
     * @request GET:/v1/projects/{projectId}/nodes/list
     * @secure
     */
    getNodeList: (
      projectId: number,
      query?: {
        /** @default "LATEST" */
        sort?: "LATEST" | "NAME";
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_NODE_LIST"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "노드 리스트를 조회했어요."
           */
          message?: object;
          /** 노드 목록 조회 응답 */
          data?: GetNodeListResponse;
        },
        any
      >({
        path: `/v1/projects/${projectId}/nodes/list`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 상태별 그룹으로 노드를 조회합니다.
     *
     * @tags Node
     * @name GetKanban
     * @summary 칸반 보드 조회
     * @request GET:/v1/projects/{projectId}/nodes/kanban
     * @secure
     */
    getKanban: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_KANBAN"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "칸반 보드를 조회했어요."
           */
          message?: object;
          /** 칸반 보드 조회 응답 (상태별 그룹핑) */
          data?: GetKanbanResponse;
        },
        any
      >({
        path: `/v1/projects/${projectId}/nodes/kanban`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  nodeAssignee = {
    /**
     * @description 노드에 담당자를 추가합니다.
     *
     * @tags NodeAssignee
     * @name CreateAssignee
     * @summary 담당자 추가
     * @request POST:/v1/projects/{projectId}/nodes/{nodeId}/assignees
     * @secure
     */
    createAssignee: (
      projectId: number,
      nodeId: number,
      data: CreateAssigneeRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "CREATE_ASSIGNEE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "담당자를 추가했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/assignees`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 노드에서 담당자를 제거합니다.
     *
     * @tags NodeAssignee
     * @name DeleteAssignee
     * @summary 담당자 제거
     * @request DELETE:/v1/projects/{projectId}/nodes/{nodeId}/assignees/{assigneeId}
     * @secure
     */
    deleteAssignee: (
      projectId: number,
      nodeId: number,
      assigneeId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_ASSIGNEE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "담당자를 제거했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}/assignees/${assigneeId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  edge = {
    /**
     * @description 프로젝트 내 모든 연결선의 ID와 시작/종료 노드를 조회합니다.
     *
     * @tags Edge
     * @name GetEdges
     * @summary 연결선 목록 조회
     * @request GET:/v1/projects/{projectId}/edges
     * @secure
     */
    getEdges: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_EDGES"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "연결선 목록을 조회했어요."
           */
          message?: object;
          /** 엣지 목록 조회 응답 */
          data?: GetEdgesResponse;
        },
        any
      >({
        path: `/v1/projects/${projectId}/edges`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 노드 간 연결선을 추가합니다.
     *
     * @tags Edge
     * @name CreateEdge
     * @summary 연결선 생성
     * @request POST:/v1/projects/{projectId}/edges
     * @secure
     */
    createEdge: (
      projectId: number,
      data: CreateEdgeRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "CREATE_EDGE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "연결선을 생성했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/edges`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 연결선을 삭제합니다.
     *
     * @tags Edge
     * @name DeleteEdge
     * @summary 연결선 삭제
     * @request DELETE:/v1/projects/{projectId}/edges/{edgeId}
     * @secure
     */
    deleteEdge: (
      projectId: number,
      edgeId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_EDGE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "연결선을 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/edges/${edgeId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  chat = {
    /**
     * No description
     *
     * @tags Chat
     * @name AddChatNode
     * @summary 참조 노드 추가
     * @request POST:/v1/projects/{projectId}/chats/{chatSessionId}/nodes
     * @secure
     */
    addChatNode: (
      projectId: number,
      chatSessionId: number,
      data: AddChatNodeRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "ADD_CHAT_NODE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "참조 노드를 추가했어요."
           */
          message?: object;
          /** 참조 노드 추가 응답 */
          data?: AddChatNodeResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/${chatSessionId}/nodes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name SendMessage
     * @summary 메시지 전송
     * @request POST:/v1/projects/{projectId}/chats/{chatSessionId}/messages
     * @secure
     */
    sendMessage: (
      projectId: number,
      chatSessionId: number,
      data: SendMessageRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "SEND_MESSAGE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "메시지를 전송했어요."
           */
          message?: object;
          /** 메시지 전송 응답 */
          data?: SendMessageResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/${chatSessionId}/messages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name StartChat
     * @summary 새 채팅 시작 (세션 생성 + 첫 메시지 전송)
     * @request POST:/v1/projects/{projectId}/chats/new
     * @secure
     */
    startChat: (
      projectId: number,
      data: StartChatRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "START_CHAT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "새 채팅을 시작했어요."
           */
          message?: object;
          /** 새 채팅 시작 응답 */
          data?: StartChatResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/new`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name GetChatSessionDetail
     * @summary 채팅 상세 조회 (메시지 내역)
     * @request GET:/v1/projects/{projectId}/chats/{chatSessionId}
     * @secure
     */
    getChatSessionDetail: (
      projectId: number,
      chatSessionId: number,
      query?: {
        /** @format int64 */
        cursorId?: number;
        /**
         * @format int32
         * @default 30
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_CHAT_SESSION"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "채팅 상세를 조회했어요."
           */
          message?: object;
          /** 채팅 상세 조회 응답 */
          data?: GetChatSessionResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/${chatSessionId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name DeleteChatSession
     * @summary 채팅 삭제
     * @request DELETE:/v1/projects/{projectId}/chats/{chatSessionId}
     * @secure
     */
    deleteChatSession: (
      projectId: number,
      chatSessionId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_CHAT_SESSION"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "채팅을 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/${chatSessionId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name UpdateChatSession
     * @summary 채팅 제목 수정
     * @request PATCH:/v1/projects/{projectId}/chats/{chatSessionId}
     * @secure
     */
    updateChatSession: (
      projectId: number,
      chatSessionId: number,
      data: UpdateChatSessionRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_CHAT_SESSION"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "채팅 제목을 수정했어요."
           */
          message?: object;
          /** 채팅 제목 수정 응답 */
          data?: UpdateChatSessionResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/${chatSessionId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name GetAllChatSessions
     * @summary 채팅 세션 목록 조회
     * @request GET:/v1/projects/{projectId}/chats
     * @secure
     */
    getAllChatSessions: (
      projectId: number,
      query?: {
        search?: string;
        /** @format int64 */
        cursorId?: number;
        /**
         * @format int32
         * @default 20
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_ALL_CHAT_SESSIONS"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "채팅 목록을 조회했어요."
           */
          message?: object;
          /** 커서 기반 페이지 응답 */
          data?: CursorSliceResponseChatSessionSummaryResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name GetReferenceUsers
     * @summary 참조 가능한 사용자 조회
     * @request GET:/v1/projects/{projectId}/chats/users
     * @secure
     */
    getReferenceUsers: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_REFERENCE_USERS"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "참조 가능한 사용자를 조회했어요."
           */
          message?: object;
          /** 참조 가능한 사용자 목록 응답 */
          data?: GetReferenceUsersResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name GetReferenceNodes
     * @summary 참조 가능한 노드 조회
     * @request GET:/v1/projects/{projectId}/chats/nodes
     * @secure
     */
    getReferenceNodes: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_REFERENCE_NODES"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "참조 가능한 노드를 조회했어요."
           */
          message?: object;
          /** 참조 가능한 노드 목록 응답 */
          data?: GetReferenceNodesResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/nodes`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chat
     * @name RemoveChatNode
     * @summary 참조 노드 제거
     * @request DELETE:/v1/projects/{projectId}/chats/{chatSessionId}/nodes/{nodeId}
     * @secure
     */
    removeChatNode: (
      projectId: number,
      chatSessionId: number,
      nodeId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "REMOVE_CHAT_NODE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "참조 노드를 제거했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/chats/${chatSessionId}/nodes/${nodeId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  file = {
    /**
     * @description 클라이언트의 S3 업로드 완료 후 파일 정보를 등록합니다.
     *
     * @tags File
     * @name ConfirmUpload
     * @summary 업로드 완료 등록
     * @request POST:/v1/files
     * @secure
     */
    confirmUpload: (
      data: ConfirmFileUploadRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "CONFIRM_UPLOAD"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "파일 업로드를 완료했어요."
           */
          message?: object;
          /** 파일 정보 응답 */
          data?: FileInformationResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/files`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags File
     * @name DeleteFile
     * @summary 파일 삭제
     * @request DELETE:/v1/files
     * @secure
     */
    deleteFile: (
      query: {
        fileKey: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_FILE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "파일을 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/files`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description S3 직접 업로드를 위한 Presigned URL을 발급합니다.
     *
     * @tags File
     * @name CreatePresignedUrl
     * @summary Presigned URL 발급
     * @request POST:/v1/files/presigned-url
     * @secure
     */
    createPresignedUrl: (
      data: CreatePresignedUrlRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "CREATE_PRESIGNED_URL"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "업로드 URL을 발급했어요."
           */
          message?: object;
          /** Presigned URL 발급 응답 */
          data?: CreatePresignedUrlResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/files/presigned-url`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  auth = {
    /**
     * @description 소셜 로그인 후 미가입 유저의 추가 정보 입력 및 회원가입 완료
     *
     * @tags Auth
     * @name Signup
     * @summary 회원가입
     * @request POST:/v1/auth/signup
     * @secure
     */
    signup: (data: SignupRequest, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "SIGNUP"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "회원가입에 성공했어요."
           */
          message?: object;
          /** 토큰 응답 */
          data?: TokenResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/auth/signup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 회원가입할 이메일 주소로 6자리 인증 코드를 발송합니다. 코드 유효시간은 5분입니다.
     *
     * @tags Auth
     * @name SendEmailVerification1
     * @summary 회원가입 이메일 인증 코드 발송
     * @request POST:/v1/auth/signup/email-verifications
     * @secure
     */
    sendEmailVerification1: (
      data: SendAuthEmailVerificationRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "SEND_EMAIL_VERIFICATION"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "인증 코드를 보냈어요. 메일함을 확인해 주세요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/auth/signup/email-verifications`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 발송된 인증 코드로 이메일 소유를 확인합니다.
     *
     * @tags Auth
     * @name VerifyEmail1
     * @summary 회원가입 이메일 인증 코드 검증
     * @request POST:/v1/auth/signup/email-verifications/verify
     * @secure
     */
    verifyEmail1: (data: VerifyAuthEmailRequest, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "VERIFY_EMAIL"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "이메일 인증에 성공했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/auth/signup/email-verifications/verify`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Refresh Token 으로 Access Token 재발급
     *
     * @tags Auth
     * @name Refresh
     * @summary 토큰 갱신
     * @request POST:/v1/auth/refresh
     * @secure
     */
    refresh: (data: RefreshTokenRequest, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "REFRESH"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "토큰을 갱신했어요."
           */
          message?: object;
          /** 토큰 응답 */
          data?: TokenResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/auth/refresh`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 현재 유저의 모든 Refresh Token 을 무효화한다.
     *
     * @tags Auth
     * @name Logout
     * @summary 로그아웃
     * @request POST:/v1/auth/logout
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "LOGOUT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "로그아웃되었어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        any
      >({
        path: `/v1/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description 소셜 인증 코드로 로그인한다. 미가입 유저인 경우 회원가입 필요 응답을 반환한다. - 가입된 유저: code=`LOGIN`, data 에 accessToken/refreshToken - 미가입 유저: code=`SIGNUP_REQUIRED`, data 에 socialProvider/socialAccessToken/name/email
     *
     * @tags Auth
     * @name Login
     * @summary 소셜 로그인
     * @request POST:/v1/auth/login/{provider}
     * @secure
     */
    login: (
      provider: string,
      data: SocialLoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "LOGIN"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "로그인을 성공했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/auth/login/${provider}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  notificationSetting = {
    /**
     * No description
     *
     * @tags NotificationSetting
     * @name GetNotificationSetting
     * @summary 프로젝트별 알림 설정 조회
     * @request GET:/v1/projects/{projectId}/notification-settings
     * @secure
     */
    getNotificationSetting: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_NOTIFICATION_SETTING"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "알림 설정을 조회했어요."
           */
          message?: object;
          /** 프로젝트 알림 설정 조회 응답 */
          data?: GetNotificationSettingResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/notification-settings`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 변경할 필드만 전달합니다.
     *
     * @tags NotificationSetting
     * @name UpdateNotificationSetting
     * @summary 프로젝트별 알림 설정 수정
     * @request PATCH:/v1/projects/{projectId}/notification-settings
     * @secure
     */
    updateNotificationSetting: (
      projectId: number,
      data: UpdateNotificationSettingRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_NOTIFICATION_SETTING"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "알림 설정을 변경했어요."
           */
          message?: object;
          /** 프로젝트 알림 설정 조회 응답 */
          data?: GetNotificationSettingResponse;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/notification-settings`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  projectMember = {
    /**
     * @description - OWNER 부여: OWNER 권한 필요 - OWNER 강등: 본인만 가능 - VIEWER ↔ MEMBER 변경: MEMBER 이상 가능
     *
     * @tags ProjectMember
     * @name UpdateMemberRole
     * @summary 멤버 권한 수정
     * @request PATCH:/v1/projects/{projectId}/members/{memberId}/role
     * @secure
     */
    updateMemberRole: (
      projectId: number,
      memberId: number,
      data: UpdateProjectMemberRoleRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "UPDATE_MEMBER_ROLE"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "멤버 권한을 변경했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/members/${memberId}/role`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectMember
     * @name GetAllMembers
     * @summary 멤버 목록 조회
     * @request GET:/v1/projects/{projectId}/members
     * @secure
     */
    getAllMembers: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_ALL_MEMBERS"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "멤버 목록을 조회했어요."
           */
          message?: object;
          /** 프로젝트 멤버 전체 조회 응답 */
          data?: GetAllProjectMembersResponse;
        },
        any
      >({
        path: `/v1/projects/${projectId}/members`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description OWNER만 삭제할 수 있습니다.
     *
     * @tags ProjectMember
     * @name DeleteMember
     * @summary 멤버 삭제
     * @request DELETE:/v1/projects/{projectId}/members/{memberId}
     * @secure
     */
    deleteMember: (
      projectId: number,
      memberId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "DELETE_MEMBER"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "멤버를 삭제했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/members/${memberId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectMember
     * @name LeaveProject
     * @summary 프로젝트 나가기
     * @request DELETE:/v1/projects/{projectId}/members/me
     * @secure
     */
    leaveProject: (projectId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "LEAVE_PROJECT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "프로젝트에서 나갔어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/members/me`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  notification = {
    /**
     * No description
     *
     * @tags Notification
     * @name MarkAsRead
     * @summary 알림 읽음 처리
     * @request PATCH:/v1/notifications/{notificationId}/read
     * @secure
     */
    markAsRead: (notificationId: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "MARK_AS_READ"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "알림을 읽음 처리했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/notifications/${notificationId}/read`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notification
     * @name MarkAllAsRead
     * @summary 전체 알림 읽음 처리
     * @request PATCH:/v1/notifications/all
     * @secure
     */
    markAllAsRead: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "MARK_ALL_AS_READ"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "전체 알림을 읽음 처리했어요."
           */
          message?: object;
          /** 응답 데이터 */
          data?: object;
        },
        any
      >({
        path: `/v1/notifications/all`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * @description isRead 필터와 커서 기반 슬라이싱을 지원합니다. 첫 요청은 cursorId 생략, 이후 응답의 nextCursorId를 그대로 전달합니다.
     *
     * @tags Notification
     * @name GetAllNotifications
     * @summary 알림 목록 조회
     * @request GET:/v1/notifications
     * @secure
     */
    getAllNotifications: (
      query?: {
        isRead?: boolean;
        /** @format int64 */
        cursorId?: number;
        /**
         * @format int32
         * @default 20
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_ALL_NOTIFICATIONS"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "알림 목록을 조회했어요."
           */
          message?: object;
          /** 커서 기반 페이지 응답 */
          data?: CursorSliceResponseNotificationSummaryResponse;
        },
        any
      >({
        path: `/v1/notifications`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notification
     * @name GetUnreadCount
     * @summary 읽지 않은 알림 개수 조회
     * @request GET:/v1/notifications/unread-count
     * @secure
     */
    getUnreadCount: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * HTTP 상태 코드
           * @format int32
           * @example 200
           */
          status?: object;
          /**
           * 응답 코드
           * @example "GET_UNREAD_COUNT"
           */
          code?: object;
          /**
           * 응답 메시지
           * @example "읽지 않은 알림 개수를 조회했어요."
           */
          message?: object;
          /** 읽지 않은 알림 개수 응답 */
          data?: GetUnreadCountResponse;
        },
        any
      >({
        path: `/v1/notifications/unread-count`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description SSE 연결 후 알림이 발생하면 `notification` 이벤트로 실시간 전달됩니다. 연결 타임아웃은 30분이며 클라이언트가 자동 재연결해야 합니다.
     *
     * @tags Notification
     * @name Subscribe
     * @summary 알림 실시간 구독 (SSE)
     * @request GET:/v1/notifications/subscribe
     * @secure
     */
    subscribe: (
      query: {
        /** @format int64 */
        projectId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SseEmitter, any>({
        path: `/v1/notifications/subscribe`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
}
