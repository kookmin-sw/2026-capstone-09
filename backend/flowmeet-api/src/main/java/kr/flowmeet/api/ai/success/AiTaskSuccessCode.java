package kr.flowmeet.api.ai.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AiTaskSuccessCode implements SuccessCode {
    GET_AI_TASK("AI 작업 결과를 조회했어요.");

    private final String message;
}