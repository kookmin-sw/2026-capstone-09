package kr.flowmeet.domain.node.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum AssigneeErrorCode implements ErrorCode {
    ASSIGNEE_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 담당자로 등록된 멤버입니다."),
    ASSIGNEE_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 노드의 담당자가 아닙니다.");

    private final HttpStatus httpStatus;
    private final String message;
}