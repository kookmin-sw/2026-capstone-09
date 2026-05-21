package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "메인 노드 요약 요청 응답")
public record RequestNodeSummaryResponse(
        @Schema(description = "AI 요약 작업 ID", example = "550e8400-e29b-41d4-a716-446655440000")
        String jobId
) {
    public static RequestNodeSummaryResponse from(final String jobId) {
        return new RequestNodeSummaryResponse(jobId);
    }
}