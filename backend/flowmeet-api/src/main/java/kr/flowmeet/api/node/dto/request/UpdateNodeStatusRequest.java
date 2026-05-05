package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.api.common.validation.ValidationMessage;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.service.vo.UpdateNodeStatusCommand;

@Schema(description = "노드 상태 변경 요청")
public record UpdateNodeStatusRequest(
        @Schema(description = "변경할 노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "DONE"})
        @NotNull(message = ValidationMessage.NODE_STATUS_REQUIRED)
        NodeStatus status
) {

    public UpdateNodeStatusCommand toCommand() {
        return new UpdateNodeStatusCommand(status);
    }
}
