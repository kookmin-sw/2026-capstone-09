package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.node.entity.Node;

@Schema(description = "참조 노드 정보")
public record ReferencedNodeResponse(
        @Schema(description = "노드 ID", example = "101")
        Long nodeId,
        @Schema(description = "노드 제목", example = "기획 문서 작성")
        String title
) {
    public static ReferencedNodeResponse from(final Node node) {
        return new ReferencedNodeResponse(node.getId(), node.getTitle());
    }
}