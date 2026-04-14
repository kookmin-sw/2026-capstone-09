package kr.flowmeet.api.node.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateAssigneeRequest(
        @NotNull(message = "사용자 ID는 필수입니다.")
        Long userId
) {
}
