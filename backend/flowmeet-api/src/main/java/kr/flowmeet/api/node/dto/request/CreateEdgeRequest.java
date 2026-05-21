package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.api.common.validation.ValidationMessage;
import kr.flowmeet.domain.node.service.vo.CreateEdgeCommand;

@Schema(description = "노드 간 엣지 생성 요청")
public record CreateEdgeRequest(
        @Schema(description = "엣지의 시작 노드 ID", example = "101")
        @NotNull(message = ValidationMessage.EDGE_START_NODE_ID_REQUIRED)
        Long startNodeId,
        @Schema(description = "엣지의 종료 노드 ID", example = "102")
        @NotNull(message = ValidationMessage.EDGE_END_NODE_ID_REQUIRED)
        Long endNodeId,
        @Schema(description = "엣지에 대한 설명", example = "로그인 성공 시 대시보드로 이동")
        String comment
) {
    public CreateEdgeCommand toCommand() {
        return new CreateEdgeCommand(startNodeId, endNodeId, comment);
    }
}
