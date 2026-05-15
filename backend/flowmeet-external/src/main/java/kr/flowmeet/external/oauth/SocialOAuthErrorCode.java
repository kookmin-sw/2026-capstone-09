package kr.flowmeet.external.oauth;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SocialOAuthErrorCode implements ErrorCode {
    SOCIAL_OAUTH_INVALID_CODE(HttpStatus.BAD_REQUEST, "인증 정보가 유효하지 않아요. 다시 로그인해 주세요."),
    SOCIAL_OAUTH_INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "소셜 로그인 정보가 유효하지 않아요. 다시 로그인해 주세요."),
    SOCIAL_OAUTH_PROVIDER_ERROR(HttpStatus.BAD_GATEWAY, "소셜 로그인이 잠시 어려워요. 잠시 후 다시 시도해 주세요."),
    SOCIAL_OAUTH_PROVIDER_UNSUPPORTED(HttpStatus.BAD_REQUEST, "아직 이 소셜 로그인은 지원하지 않아요.");

    private final HttpStatus httpStatus;
    private final String message;
}
