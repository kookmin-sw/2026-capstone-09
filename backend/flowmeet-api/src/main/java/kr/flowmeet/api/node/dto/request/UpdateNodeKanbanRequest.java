package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.api.common.validation.ValidationMessage;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.service.vo.UpdateNodeKanbanCommand;

@Schema(description = "칸반 카드 이동(드래그 앤 드롭) 요청")
public record UpdateNodeKanbanRequest(
        @Schema(description = "변경할 노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "ON_HOLD", "DONE", "CLOSED"})
        @NotNull(message = ValidationMessage.NODE_STATUS_REQUIRED)
        NodeStatus status,
        @Schema(description = "칸반 내 정렬 순서", example = "1024")
        @NotNull(message = ValidationMessage.NODE_SORT_ORDER_REQUIRED)
        Integer sortOrder
) {

    public UpdateNodeKanbanCommand toCommand() {
        return new UpdateNodeKanbanCommand(status, sortOrder);
    }
}
