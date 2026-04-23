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

/** 노드 담당자 지정 요청 */
export interface CreateAssigneeRequest {
  /**
   * 담당자로 지정할 사용자 ID
   * @format int64
   * @example 91
   */
  userId: number;
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

/** 노드 수정 요청 (변경할 필드만 전달) */
export interface UpdateNodeRequest {
  /**
   * 변경할 제목
   * @example "로그인 화면 기획 (v2)"
   */
  title?: string;
  /**
   * 변경할 설명
   * @example "OAuth2 로그인 플로우 정리 및 와이어프레임 첨부"
   */
  description?: string;
  /**
   * 변경할 노트 내용(마크다운)
   * @example "## 로그인 시나리오
   * - Google OAuth ..."
   */
  noteContent?: string;
  /**
   * 변경할 노드 상태
   * @example "IN_PROGRESS"
   */
  status?: "WAITING" | "IN_PROGRESS" | "DONE";
  /**
   * 칸반 내 정렬 순서
   * @format int32
   * @example 1024
   */
  sortOrder?: number;
}

/** 노드 상태 변경(드래그 앤 드롭) 요청 */
export interface UpdateNodeStatusRequest {
  /**
   * 변경할 노드 상태
   * @example "IN_PROGRESS"
   */
  status: "WAITING" | "IN_PROGRESS" | "DONE";
  /**
   * 칸반 내 정렬 순서
   * @format int32
   * @example 1024
   */
  sortOrder: number;
}

/** 프로젝트 멤버 권한 변경 요청 */
export interface UpdateProjectMemberRoleRequest {
  /**
   * 변경할 권한
   * @example "MEMBER"
   */
  role: "VIEWER" | "MEMBER" | "OWNER";
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
   * 마지막 수정 시각
   * @format date-time
   * @example "2026-04-19T10:15:30"
   */
  updatedAt?: string;
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
   * 노드 상태
   * @example "IN_PROGRESS"
   */
  status?: "WAITING" | "IN_PROGRESS" | "DONE";
  /** 부여된 태그 목록 */
  tags?: TagItem[];
}

/** 노드 검색 응답 */
export interface SearchNodeResponse {
  /** 검색된 노드 목록 */
  nodes?: SearchItem[];
}

/** 노드 담당자 정보 */
export interface AssigneeItem {
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

/** 엣지 생성자 정보 */
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
   * @example "https://cdn.flowmeet.kr/profile/91.png"
   */
  profileImageUrl?: string;
}

/** 노드 간 엣지 항목 */
export interface EdgeItem {
  /**
   * 엣지 ID
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
  /** 엣지를 생성한 사용자 정보 */
  createdBy?: EdgeCreatorItem;
  /**
   * 엣지 설명
   * @example "로그인 성공 시 대시보드로 이동"
   */
  comment?: string;
}

/** 플로우차트 조회 응답 (노드와 엣지) */
export interface GetFlowchartResponse {
  /** 노드 목록 */
  nodes?: NodeItem[];
  /** 노드 간 엣지 목록 */
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
  status?: "WAITING" | "IN_PROGRESS" | "DONE";
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
  status?: "WAITING" | "IN_PROGRESS" | "DONE";
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
  status?: string;
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
  status?: "WAITING" | "IN_PROGRESS" | "DONE";
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
  /** 완료 상태의 노드 목록 */
  done?: KanbanItem[];
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
   * 관련 노드 ID
   * @format int64
   * @example 128
   */
  nodeId?: number;
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
        CommonResponseCursorSliceResponseProjectSummaryResponse,
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
      this.request<CommonResponseCreateProjectResponse, any>({
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
        CommonResponseObject,
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
        CommonResponseAcceptProjectInvitationResponse,
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
        CommonResponseGetProjectResponse,
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
      this.request<CommonResponseObject, any>({
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
        CommonResponseObject,
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
      data: number,
      params: RequestParams = {},
    ) =>
      this.request<
        CommonResponseObject,
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
        CommonResponseProjectUrlResponse,
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
        CommonResponseObject,
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
        CommonResponseProjectUrlResponse,
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
      this.request<CommonResponseGetAllTagsResponse, any>({
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
        CommonResponseObject,
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
        CommonResponseObject,
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
        CommonResponseObject,
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
        CommonResponseObject,
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
      this.request<CommonResponseObject, any>({
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
      this.request<CommonResponseGetFlowchartResponse, any>({
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
        CommonResponseObject,
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
        CommonResponseGetNodeResponse,
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
        CommonResponseObject,
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
     * @description 노드 제목, 설명, 노트, 상태, 정렬순서를 수정합니다.
     *
     * @tags Node
     * @name UpdateNode
     * @summary 노드 수정
     * @request PATCH:/v1/projects/{projectId}/nodes/{nodeId}
     * @secure
     */
    updateNode: (
      projectId: number,
      nodeId: number,
      data: UpdateNodeRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        CommonResponseObject,
        {
          /** @format int32 */
          status?: number;
          code?: string;
          message?: string;
          data?: object;
        }
      >({
        path: `/v1/projects/${projectId}/nodes/${nodeId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 드래그 & 드롭으로 상태와 순서를 변경합니다.
     *
     * @tags Node
     * @name UpdateNodeStatus
     * @summary 칸반 상태 변경
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
        CommonResponseObject,
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
      this.request<CommonResponseSearchNodeResponse, any>({
        path: `/v1/projects/${projectId}/search`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 노드를 리스트 형태로 조회합니다.
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
        sort?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommonResponseGetNodeListResponse, any>({
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
      this.request<CommonResponseGetKanbanResponse, any>({
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
        CommonResponseObject,
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
        CommonResponseObject,
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
        CommonResponseObject,
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
        CommonResponseObject,
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
        CommonResponseFileInformationResponse,
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
        CommonResponseObject,
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
        CommonResponseCreatePresignedUrlResponse,
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
  user = {
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
      this.request<CommonResponseGetUserResponse, any>({
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
        CommonResponseObject,
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
     * No description
     *
     * @tags User
     * @name UpdateMe
     * @summary 내 정보 수정
     * @request PATCH:/v1/users/me
     * @secure
     */
    updateMe: (data: UpdateUserRequest, params: RequestParams = {}) =>
      this.request<
        CommonResponseUpdateUserResponse,
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
    updateProfileImage: (data: number, params: RequestParams = {}) =>
      this.request<
        CommonResponseObject,
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
        CommonResponseGetNotificationSettingResponse,
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
        CommonResponseGetNotificationSettingResponse,
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
        CommonResponseObject,
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
      this.request<CommonResponseGetAllProjectMembersResponse, any>({
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
        CommonResponseObject,
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
        CommonResponseObject,
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
        CommonResponseObject,
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
      this.request<CommonResponseObject, any>({
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
        CommonResponseCursorSliceResponseNotificationSummaryResponse,
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
      this.request<CommonResponseGetUnreadCountResponse, any>({
        path: `/v1/notifications/unread-count`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
