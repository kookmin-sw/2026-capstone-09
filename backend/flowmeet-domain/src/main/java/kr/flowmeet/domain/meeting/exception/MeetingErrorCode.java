package kr.flowmeet.domain.meeting.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum MeetingErrorCode implements ErrorCode {
    MEETING_NOT_FOUND(HttpStatus.NOT_FOUND, "회의 정보를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}