package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "노드 담당자 지정 요청")
public record CreateAssigneeRequest(
        @Schema(description = "담당자로 지정할 사용자 ID", example = "91")
        @NotNull(message = ValidationMessage.ASSIGNEE_USER_ID_REQUIRED)
        Long userId
) {
}
