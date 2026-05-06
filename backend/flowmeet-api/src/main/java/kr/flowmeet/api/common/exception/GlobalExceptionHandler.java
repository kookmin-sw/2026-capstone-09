package kr.flowmeet.api.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.util.SensitiveDataMasker;
import kr.flowmeet.common.exception.CustomException;
import kr.flowmeet.common.exception.ErrorCode;
import kr.flowmeet.external.notification.ErrorNotifier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.util.ContentCachingRequestWrapper;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private static final int REQUEST_BODY_LOG_LIMIT = 1500;

    private final ErrorNotifier errorNotifier;

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CommonResponse<?>> handleCustomException(final CustomException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        log.error("에러 발생: ({}) {}", errorCode.name(), errorCode.getMessage());

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(CommonResponse.error(errorCode));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<?>> handleException(
            final HttpServletRequest request,
            final Exception exception
    ) {

        log.error("에러 발생: ({}) {}", exception.getClass().getSimpleName(), exception.getMessage());

        exception.printStackTrace();

        errorNotifier.notifyError(
                "[" + exception.getClass().getSimpleName() + "] (" + request.getMethod() + ") " + request.getRequestURI(),
                exception.getMessage(),
                extractRequestBody(request),
                exception
        );

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

    private String extractRequestBody(final HttpServletRequest request) {
        ContentCachingRequestWrapper wrapper = unwrapCachingRequest(request);
        if (wrapper == null) {
            return null;
        }
        byte[] buf = wrapper.getContentAsByteArray();
        if (buf.length == 0) {
            return null;
        }
        String body = new String(buf, StandardCharsets.UTF_8);
        String masked = SensitiveDataMasker.mask(body);
        if (masked.length() > REQUEST_BODY_LOG_LIMIT) {
            return masked.substring(0, REQUEST_BODY_LOG_LIMIT) + "...";
        }
        return masked;
    }

    private ContentCachingRequestWrapper unwrapCachingRequest(final HttpServletRequest request) {
        if (request instanceof ContentCachingRequestWrapper wrapper) {
            return wrapper;
        }
        return null;
    }
}
