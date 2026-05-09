package kr.flowmeet.api.ai.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.ai.entity.AiTask;
import kr.flowmeet.domain.ai.entity.AiTaskStatus;
import kr.flowmeet.domain.ai.entity.AiTaskType;

@Schema(description = "AI 작업 결과 조회 응답")
public record GetAiTaskResponse(
        @Schema(description = "작업 ID") String jobId,
        @Schema(description = "작업 유형") AiTaskType taskType,
        @Schema(description = "작업 상태") AiTaskStatus status,
        @Schema(description = "요약 결과") String result,
        @Schema(description = "Mermaid 다이어그램 코드") String mermaidCode,
        @Schema(description = "에러 메시지") String errorMessage
) {

    public static GetAiTaskResponse from(final AiTask aiTask) {
        return new GetAiTaskResponse(
                aiTask.getId(),
                aiTask.getTaskType(),
                aiTask.getStatus(),
                aiTask.getResult(),
                aiTask.getMermaidCode(),
                aiTask.getErrorMessage()
        );
    }
}