package kr.flowmeet.api.common.exception;

import kr.flowmeet.common.exception.CustomException;
import kr.flowmeet.common.exception.ErrorCode;

public class ApiException extends CustomException {
  public ApiException(ErrorCode errorCode) {
    super(errorCode);
  }
}
