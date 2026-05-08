package kr.flowmeet.api.dto;

import kr.flowmeet.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public record CommonResponse<T>(
        int status,
        String code,
        String message,
        T data
) {
    private static final String SUCCESS_CODE = "OK";
    private static final String SUCCESS_MESSAGE = "요청에 성공했습니다.";

    public static CommonResponse<?> ok() {
        return ok(null);
    }

    public static <T> CommonResponse<T> ok(final T data) {
        return new CommonResponse<>(HttpStatus.OK.value(), SUCCESS_CODE, SUCCESS_MESSAGE, data);
    }

    public static CommonResponse<?> error(final ErrorCode errorCode) {
        return new CommonResponse<>(errorCode.getHttpStatus().value(), errorCode.name(), errorCode.getMessage(), null);
    }

    public static CommonResponse<?> error(final Exception exception, final HttpStatus httpStatus) {
        return new CommonResponse<>(httpStatus.value(), exception.getClass().getSimpleName(), exception.getMessage(), null);
    }

    public static CommonResponse<?> error(final Exception exception) {
        return error(exception, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
