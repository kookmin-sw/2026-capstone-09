package kr.flowmeet.api.node.dto.request;

import jakarta.validation.constraints.NotNull;

public record AddNodeTagRequest(
        @NotNull(message = "태그 ID는 필수입니다.")
        Long tagId
) {
}
