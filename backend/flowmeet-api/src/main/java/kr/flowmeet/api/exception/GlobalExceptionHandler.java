package kr.flowmeet.api.exception;

import kr.flowmeet.api.dto.CommonResponse;
import kr.flowmeet.common.exception.CustomException;
import kr.flowmeet.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CommonResponse<?>> handleCustomException(final CustomException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        log.error("에러 발생: ({}) {}", errorCode.name(), errorCode.getMessage());

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(CommonResponse.error(errorCode));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<?>> handleException(final Exception exception) {

        log.error("에러 발생: ({}) {}", exception.getClass().getSimpleName(), exception.getMessage());

        CommonResponse<?> response = CommonResponse.error(exception);

        return ResponseEntity
                .status(response.status())
                .body(response);
    }
}
