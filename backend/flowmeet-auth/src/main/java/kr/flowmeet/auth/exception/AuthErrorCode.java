package kr.flowmeet.auth.exception;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AuthErrorCode implements ErrorCode {
    INVALID_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "로그인 정보가 유효하지 않아요. 다시 로그인해 주세요."),
    EXPIRED_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "로그인 유효기간이 만료됐어요."),
    AUTH_INVALID_CODE(HttpStatus.BAD_REQUEST, "인증 정보가 유효하지 않아요. 다시 로그인해 주세요."),
    AUTH_PROVIDER_ERROR(HttpStatus.BAD_GATEWAY, "소셜 로그인이 잠시 어려워요. 잠시 후 다시 시도해 주세요."),
    AUTH_INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "로그인 정보가 유효하지 않아요. 다시 로그인해 주세요."),
    AUTH_EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "로그인 유효기간이 만료됐어요. 다시 로그인해 주세요."),
    AUTH_SOCIAL_ID_DUPLICATED(HttpStatus.CONFLICT, "이미 존재하는 소셜 로그인 계정이 있어요."),
    AUTH_INVALID_SOCIAL_TOKEN(HttpStatus.UNAUTHORIZED, "소셜 로그인 정보가 유효하지 않아요. 다시 로그인해 주세요."),
    AUTH_PROVIDER_MISMATCH(HttpStatus.BAD_REQUEST, "소셜 로그인 정보가 일치하지 않아요. 다시 로그인해 주세요."),
    AUTH_PROVIDER_UNSUPPORTED(HttpStatus.BAD_REQUEST, "아직 이 소셜 로그인은 지원하지 않아요."),
    AUTH_EMAIL_ALREADY_REGISTERED(HttpStatus.CONFLICT, "이미 %s(%s)로 가입된 이메일이에요. 기존 계정으로 로그인해 주세요.");

    private final HttpStatus httpStatus;
    private final String message;
}
