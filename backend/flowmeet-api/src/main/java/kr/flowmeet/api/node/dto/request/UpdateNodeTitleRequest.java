package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "노드 제목 수정 요청")
public record UpdateNodeTitleRequest(
        @Schema(description = "변경할 제목", example = "로그인 화면 기획 (v2)")
        @NotBlank(message = ValidationMessage.NODE_TITLE_REQUIRED)
        String title
) {
}
