package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "노드 태그 추가 요청")
public record AddNodeTagRequest(
        @Schema(description = "추가할 태그 ID", example = "5")
        @NotNull(message = "태그 ID는 필수입니다.")
        Long tagId
) {
}
