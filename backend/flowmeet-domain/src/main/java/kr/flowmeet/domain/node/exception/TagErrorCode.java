package kr.flowmeet.domain.node.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum TagErrorCode implements ErrorCode {
    TAG_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 태그예요."),
    TAG_NAME_DUPLICATED(HttpStatus.CONFLICT, "동일한 이름의 태그가 이미 있어요."),
    NODE_TAG_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 연결된 태그예요.");

    private final HttpStatus httpStatus;
    private final String message;
}