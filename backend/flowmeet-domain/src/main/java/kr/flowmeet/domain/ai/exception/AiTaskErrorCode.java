package kr.flowmeet.domain.ai.exception;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AiTaskErrorCode implements ErrorCode {
    AI_TASK_NOT_FOUND(HttpStatus.NOT_FOUND, "AI 작업을 찾을 수 없어요.");

    private final HttpStatus httpStatus;
    private final String message;
}