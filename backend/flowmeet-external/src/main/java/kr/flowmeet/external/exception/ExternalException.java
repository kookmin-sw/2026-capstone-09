package kr.flowmeet.external.exception;

import kr.flowmeet.common.exception.CustomException;
import kr.flowmeet.common.exception.ErrorCode;

public class ExternalException extends CustomException {
    public ExternalException(ErrorCode errorCode) {
        super(errorCode);
    }
}