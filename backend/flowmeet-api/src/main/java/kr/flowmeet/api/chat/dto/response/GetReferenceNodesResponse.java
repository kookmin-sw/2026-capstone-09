package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import kr.flowmeet.domain.node.entity.Node;

@Schema(description = "참조 가능한 노드 목록 응답")
public record GetReferenceNodesResponse(
        @Schema(description = "노드 목록")
        List<ReferencedNodeResponse> nodes
) {
    public static GetReferenceNodesResponse from(final List<Node> nodes) {
        return new GetReferenceNodesResponse(
                nodes.stream().map(ReferencedNodeResponse::from).toList()
        );
    }
}