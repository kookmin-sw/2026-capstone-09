package kr.flowmeet.external.meeting;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MeetingExternalErrorCode implements ErrorCode {
    MEETING_PROVIDER_CREATE_FAILED(HttpStatus.BAD_GATEWAY, "화상 회의 링크를 만들지 못했어요. 잠시 후 다시 시도해 주세요."),
    MEETING_PROVIDER_DELETE_FAILED(HttpStatus.BAD_GATEWAY, "화상 회의 링크 정리에 실패했어요. 잠시 후 다시 시도해 주세요."),
    MEETING_PROVIDER_NOT_AVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "화상 회의 서비스 설정을 확인해 주세요.");

    private final HttpStatus httpStatus;
    private final String message;
}
