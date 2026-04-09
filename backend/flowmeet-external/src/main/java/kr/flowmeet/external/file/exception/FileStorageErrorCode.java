package kr.flowmeet.external.file.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum FileStorageErrorCode implements ErrorCode {
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "파일 크기가 제한을 초과했습니다."),
    FILE_INVALID_TYPE(HttpStatus.BAD_REQUEST, "지원하지 않는 파일 형식입니다.");

    private final HttpStatus httpStatus;
    private final String message;
}