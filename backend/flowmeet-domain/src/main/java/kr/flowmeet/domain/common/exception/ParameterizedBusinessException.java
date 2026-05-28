package kr.flowmeet.domain.common.exception;

import kr.flowmeet.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public class ParameterizedBusinessException extends BusinessException {

    public ParameterizedBusinessException(final ErrorCode errorCode, final Object... args) {
        super(new FormattedErrorCode(errorCode, args));
    }

    private static class FormattedErrorCode implements ErrorCode {

        private final ErrorCode base;
        private final String formattedMessage;

        FormattedErrorCode(final ErrorCode base, final Object... args) {
            this.base = base;
            this.formattedMessage = String.format(base.getMessage(), args);
        }

        @Override
        public HttpStatus getHttpStatus() {
            return base.getHttpStatus();
        }

        @Override
        public String getMessage() {
            return formattedMessage;
        }

        @Override
        public String name() {
            return base.name();
        }
    }
}
