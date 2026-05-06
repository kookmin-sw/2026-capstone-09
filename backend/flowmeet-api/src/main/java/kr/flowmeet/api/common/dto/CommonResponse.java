package kr.flowmeet.api.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.common.exception.ErrorCode;
import kr.flowmeet.common.response.SuccessCode;
import org.springframework.http.HttpStatus;

@Schema(description = "공통 응답 형식")
public record CommonResponse<T>(
        @Schema(description = "HTTP 상태 코드", example = "200")
        int status,
        @Schema(description = "응답 코드", example = "OK")
        String code,
        @Schema(description = "응답 메시지", example = "요청에 성공했습니다.")
        String message,
        @Schema(description = "응답 데이터")
        T data
) {
    private static final String SUCCESS_CODE = "OK";
    private static final String SUCCESS_MESSAGE = "요청에 성공했습니다.";
    private static final String DEFAULT_ERROR_MESSAGE = "오류가 발생했어요. 잠시 후 다시 시도해 주세요.";

    public static CommonResponse<?> ok() {
        return ok(null);
    }

    public static <T> CommonResponse<T> ok(final T data) {
        return new CommonResponse<>(HttpStatus.OK.value(), SUCCESS_CODE, SUCCESS_MESSAGE, data);
    }

    public static CommonResponse<?> ok(final SuccessCode successCode) {
        return ok(successCode, null);
    }

    public static <T> CommonResponse<T> ok(final SuccessCode successCode, final T data) {
        return new CommonResponse<>(HttpStatus.OK.value(), successCode.name(), successCode.getMessage(), data);
    }

    public static CommonResponse<?> error(final ErrorCode errorCode) {
        return new CommonResponse<>(errorCode.getHttpStatus().value(), errorCode.name(), errorCode.getMessage(), null);
    }

    public static CommonResponse<?> error(final Exception exception, final HttpStatus httpStatus, final String message) {
        return new CommonResponse<>(httpStatus.value(), exception.getClass().getSimpleName(), message, null);
    }

    public static CommonResponse<?> error(final Exception exception, final HttpStatus httpStatus) {
        return error(exception, httpStatus, DEFAULT_ERROR_MESSAGE);
    }

    public static CommonResponse<?> error(final Exception exception) {
        return error(exception, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
