package kr.flowmeet.domain.chat.exception;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ChatErrorCode implements ErrorCode {
    CHAT_SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 채팅 세션이에요."),
    CHAT_SESSION_ACCESS_DENIED(HttpStatus.FORBIDDEN, "해당 채팅 세션에 접근 권한이 없어요."),
    CHAT_NODE_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 채팅에 참조된 노드가 아니에요."),
    CHAT_NODE_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 참조 중인 노드예요.");

    private final HttpStatus httpStatus;
    private final String message;
}