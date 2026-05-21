package kr.flowmeet.external.ai;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AiAgentErrorCode implements ErrorCode {

    AI_AGENT_UNAVAILABLE(HttpStatus.BAD_GATEWAY, "AI Agent 호출에 실패했어요.");

    private final HttpStatus httpStatus;
    private final String message;
}