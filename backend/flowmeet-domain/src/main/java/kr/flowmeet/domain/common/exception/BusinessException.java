package kr.flowmeet.domain.common.exception;

import kr.flowmeet.common.exception.CustomException;
import kr.flowmeet.common.exception.ErrorCode;

public class BusinessException extends CustomException {
    public BusinessException(ErrorCode errorCode) {
        super(errorCode);
    }
}
