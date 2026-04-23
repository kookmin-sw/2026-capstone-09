package kr.flowmeet.auth.exception;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import org.springframework.security.core.AuthenticationException;

@Getter
public class JwtAuthenticationException extends AuthenticationException {

    private final ErrorCode errorCode;

    public JwtAuthenticationException(final AuthException cause) {
        super(cause.getMessage(), cause);
        this.errorCode = cause.getErrorCode();
    }
}
