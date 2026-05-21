package kr.flowmeet.domain.file.entity;

public enum FileDomainType {
    USER_PROFILE, // 유저 프로필 이미지
    PROJECT_IMAGE, // 프로젝트 대표 이미지
    NODE_ATTACHMENT, // 노드 첨부파일
    NODE_NOTE_IMAGE, // 노드 노트 이미지
    MEETING_SUMMARY, // 회의록 첨부파일
    CHAT_ATTACHMENT, // 채팅 첨부파일
    TEMP // 업로드 완료, 도메인 미연결
}
