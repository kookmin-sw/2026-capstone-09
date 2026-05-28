package kr.flowmeet.domain.meeting.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum MeetingErrorCode implements ErrorCode {
    MEETING_NOT_FOUND(HttpStatus.NOT_FOUND, "회의 정보를 찾을 수 없어요."),
    MEETING_ALREADY_EXISTS(HttpStatus.CONFLICT, "노드에 이미 생성된 회의가 있어요."),
    MEETING_INVALID_TIME(HttpStatus.BAD_REQUEST, "회의 시작 시간은 현재 이후로 설정해 주세요."),
    MEETING_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "회의 생성자나 관리자만 회의를 삭제할 수 있어요."),
    MEETING_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "회의 생성자나 관리자만 회의를 수정할 수 있어요."),
    MEETING_IN_PROGRESS(HttpStatus.CONFLICT, "진행 중인 회의는 삭제할 수 없어요."),
    MEETING_NOT_SCHEDULED(HttpStatus.CONFLICT, "예정된 회의만 수정할 수 있어요."),
    MEETING_PARTICIPANT_NOT_MEMBER(HttpStatus.BAD_REQUEST, "프로젝트에 소속되지 않은 참여자가 있어요."),
    MEETING_NOT_IN_PROGRESS(HttpStatus.CONFLICT, "진행 중인 회의만 종료할 수 있어요."),
    MEETING_NO_TRANSCRIPT(HttpStatus.BAD_REQUEST, "저장된 자막이 없어요.");

    private final HttpStatus httpStatus;
    private final String message;
}
