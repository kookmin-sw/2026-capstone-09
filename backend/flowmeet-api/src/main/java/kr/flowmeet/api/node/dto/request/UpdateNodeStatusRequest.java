package kr.flowmeet.api.node.dto.request;

import jakarta.validation.constraints.NotNull;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.service.vo.UpdateNodeStatusCommand;

public record UpdateNodeStatusRequest(
        @NotNull(message = "상태는 필수로 입력해 주세요.")
        NodeStatus status,
        @NotNull(message = "정렬 순서는 필수로 입력해 주세요.")
        Integer sortOrder
) {

    public UpdateNodeStatusCommand toCommand() {
        return new UpdateNodeStatusCommand(status, sortOrder);
    }
}