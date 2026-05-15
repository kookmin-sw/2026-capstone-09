package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "노드 간 엣지 수정 요청")
public record UpdateEdgeRequest(
        @Schema(description = "엣지의 시작 노드 ID", example = "101")
        @NotNull(message = ValidationMessage.EDGE_START_NODE_ID_REQUIRED)
        Long startNodeId,
        @Schema(description = "엣지의 종료 노드 ID", example = "102")
        @NotNull(message = ValidationMessage.EDGE_END_NODE_ID_REQUIRED)
        Long endNodeId
) {
}
