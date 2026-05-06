package kr.flowmeet.api.chat.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "참조 노드 추가 요청")
public record AddChatNodeRequest(
        @Schema(description = "참조할 노드 ID", example = "101")
        @NotNull(message = "노드 ID를 입력해 주세요.")
        Long nodeId
) {
}