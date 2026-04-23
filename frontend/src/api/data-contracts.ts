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
