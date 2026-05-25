package kr.flowmeet.domain.file.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum FileErrorCode implements ErrorCode {
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 파일이에요."),
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "파일 크기가 제한을 초과했어요."),
    FILE_INVALID_TYPE(HttpStatus.BAD_REQUEST, "지원하지 않는 파일 형식이에요."),
    FILE_UPLOAD_NOT_COMPLETED(HttpStatus.BAD_REQUEST, "아직 파일 업로드가 완료되지 않았어요."),
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "파일을 업로드하지 못했어요."),
    FILE_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "파일을 삭제할 권한이 없어요.");

    private final HttpStatus httpStatus;
    private final String message;
}
