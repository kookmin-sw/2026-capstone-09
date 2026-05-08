package kr.flowmeet.domain.auth.exception;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AuthDomainErrorCode implements ErrorCode {
    AUTH_INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "로그인 정보가 유효하지 않아요. 다시 로그인해 주세요."),
    AUTH_EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "로그인 유효기간이 만료됐어요. 다시 로그인해 주세요.");

    private final HttpStatus httpStatus;
    private final String message;
}
