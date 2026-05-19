package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import kr.flowmeet.domain.node.entity.Edge;

@Schema(description = "엣지 목록 조회 응답")
public record GetEdgesResponse(
        @Schema(description = "연결선 목록")
        List<EdgeItem> edges
) {

    public static GetEdgesResponse of(final List<Edge> edges) {
        return new GetEdgesResponse(
                edges.stream().map(EdgeItem::from).toList()
        );
    }

    @Schema(description = "연결선 항목")
    public record EdgeItem(
            @Schema(description = "연결선 ID", example = "9001")
            Long edgeId,
            @Schema(description = "시작 노드 ID", example = "101")
            Long startNodeId,
            @Schema(description = "종료 노드 ID", example = "102")
            Long endNodeId
    ) {

        public static EdgeItem from(final Edge edge) {
            return new EdgeItem(edge.getId(), edge.getStartNodeId(), edge.getEndNodeId());
        }
    }
}
