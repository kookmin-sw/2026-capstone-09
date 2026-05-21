package kr.flowmeet.domain.transcript.exception;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MeetingTranscriptErrorCode implements ErrorCode {
    TRANSCRIPT_NOT_FOUND(HttpStatus.NOT_FOUND, "자막 데이터를 찾을 수 없어요.");

    private final HttpStatus httpStatus;
    private final String message;
}