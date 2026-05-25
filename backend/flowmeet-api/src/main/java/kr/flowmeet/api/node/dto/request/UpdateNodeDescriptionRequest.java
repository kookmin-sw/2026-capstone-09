package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "노드 설명 수정 요청")
public record UpdateNodeDescriptionRequest(
        @Schema(description = "변경할 설명", example = "OAuth2 로그인 플로우 정리 및 와이어프레임 첨부")
        String description
) {
}
