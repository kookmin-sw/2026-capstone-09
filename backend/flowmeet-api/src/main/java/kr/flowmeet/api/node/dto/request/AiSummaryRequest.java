package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Schema(description = "AI 노드 요약 요청")
public record AiSummaryRequest(
        @Schema(description = "요약할 노드 ID 목록", example = "[101, 102, 103]")
        @NotEmpty(message = "요약할 노드를 선택해 주세요.")
        List<Long> nodeIds
) {
}
