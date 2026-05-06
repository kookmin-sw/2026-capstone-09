package kr.flowmeet.api.common.exception;

import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.common.exception.CustomException;
import kr.flowmeet.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

        exception.printStackTrace();

        CommonResponse<?> response = CommonResponse.error(exception);

        return ResponseEntity
                .status(response.status())
                .body(response);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<CommonResponse<?>> handleBindException(BindException exception) {

        return handleValidationException(exception);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponse<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {

        return handleValidationException(exception);
    }

    private ResponseEntity<CommonResponse<?>> handleValidationException(BindException exception) {

        HttpStatus status = HttpStatus.BAD_REQUEST;

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("입력값이 올바르지 않습니다.");

        return ResponseEntity
                .status(status)
                .body(CommonResponse.error(exception, status, message));
    }
}
