package kr.flowmeet.domain.node.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum EdgeErrorCode implements ErrorCode {
    EDGE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 연결선입니다."),
    EDGE_DUPLICATE(HttpStatus.CONFLICT, "동일한 연결선이 이미 존재합니다."),
    ;

    private final HttpStatus httpStatus;
    private final String message;
}
