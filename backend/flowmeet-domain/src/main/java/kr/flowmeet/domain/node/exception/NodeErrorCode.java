package kr.flowmeet.domain.node.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum NodeErrorCode implements ErrorCode {
    NODE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 노드입니다."),
    NODE_CREATE_FORBIDDEN(HttpStatus.FORBIDDEN, "VIEWER는 노드를 추가할 수 없습니다."),
    NODE_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "VIEWER는 노드를 수정할 수 없습니다."),
    NODE_SUMMARY_EMPTY(HttpStatus.BAD_REQUEST, "요약할 노드가 선택되지 않았습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
