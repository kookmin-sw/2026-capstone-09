package kr.flowmeet.auth.exception;

import kr.flowmeet.common.exception.CustomException;

public class AuthException extends CustomException {

    public AuthException(final AuthErrorCode authErrorCode) {
        super(authErrorCode);
    }
}
