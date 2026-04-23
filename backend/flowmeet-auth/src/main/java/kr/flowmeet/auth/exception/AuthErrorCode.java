package kr.flowmeet.auth.exception;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AuthErrorCode implements ErrorCode {
    INVALID_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 AccessToken이에요."),
    EXPIRED_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "로그인 유효기간이 만료됐어요.");

    private final HttpStatus httpStatus;
    private final String message;
}
