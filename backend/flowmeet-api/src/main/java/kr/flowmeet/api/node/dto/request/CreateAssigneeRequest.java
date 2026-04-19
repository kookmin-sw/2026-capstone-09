package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "노드 담당자 지정 요청")
public record CreateAssigneeRequest(
        @Schema(description = "담당자로 지정할 사용자 ID", example = "91")
        @NotNull(message = "사용자 ID는 필수입니다.")
        Long userId
) {
}
