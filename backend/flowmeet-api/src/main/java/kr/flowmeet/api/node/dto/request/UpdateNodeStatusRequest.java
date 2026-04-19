package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.service.vo.UpdateNodeStatusCommand;

@Schema(description = "노드 상태 변경(드래그 앤 드롭) 요청")
public record UpdateNodeStatusRequest(
        @Schema(description = "변경할 노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "DONE"})
        @NotNull(message = "상태는 필수로 입력해 주세요.")
        NodeStatus status,
        @Schema(description = "칸반 내 정렬 순서", example = "1024")
        @NotNull(message = "정렬 순서는 필수로 입력해 주세요.")
        Integer sortOrder
) {

    public UpdateNodeStatusCommand toCommand() {
        return new UpdateNodeStatusCommand(status, sortOrder);
    }
}
