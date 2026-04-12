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
    EDGE_CREATE_FORBIDDEN(HttpStatus.FORBIDDEN, "연결선을 생성할 권한이 없습니다."),
    EDGE_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "연결선을 삭제할 권한이 없습니다.")
    ;

    private final HttpStatus httpStatus;
    private final String message;
}
