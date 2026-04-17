package kr.flowmeet.domain.node.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum NodeErrorCode implements ErrorCode {
    NODE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 노드입니다."),
    ACTIVE_MEETING_EXISTS(HttpStatus.CONFLICT, "진행 중인 회의가 있는 노드는 삭제할 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
