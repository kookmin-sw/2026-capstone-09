package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(description = "드래그 노드 분석 요청")
public record AnalyzeDraggedNodesRequest(
        @Schema(description = "분석할 노드 ID 목록 (최소 2개)", example = "[1, 2, 3]")
        @NotEmpty
        @Size(min = 2, message = "분석할 노드는 2개 이상 선택해야 해요.")
        List<Long> nodeIds
) {}