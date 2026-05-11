package kr.flowmeet.domain.node.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum NodeErrorCode implements ErrorCode {
    NODE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 노드예요."),
    ACTIVE_MEETING_EXISTS(HttpStatus.CONFLICT, "진행 중인 회의가 있는 노드는 삭제할 수 없어요."),
    NO_CHILD_SUMMARY(HttpStatus.BAD_REQUEST, "요약할 하위 노드 회의록이 없어요."),
    NOT_ENOUGH_SUMMARIES_FOR_ANALYSIS(HttpStatus.BAD_REQUEST, "분석 가능한 회의 요약이 2개 이상 필요해요.");

    private final HttpStatus httpStatus;
    private final String message;
}
