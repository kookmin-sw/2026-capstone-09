package kr.flowmeet.domain.emailverification.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum EmailVerificationErrorCode implements ErrorCode {
    EMAIL_VERIFICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "인증 코드를 다시 요청해 주세요."),
    EMAIL_VERIFICATION_CODE_INVALID(HttpStatus.BAD_REQUEST, "인증 코드를 다시 확인해 주세요."),
    EMAIL_VERIFICATION_CODE_EXPIRED(HttpStatus.BAD_REQUEST, "인증 시간이 지났어요. 인증 코드를 다시 요청해 주세요."),
    EMAIL_VERIFICATION_REQUIRED(HttpStatus.BAD_REQUEST, "이메일을 먼저 인증해 주세요.");

    private final HttpStatus httpStatus;
    private final String message;
}
