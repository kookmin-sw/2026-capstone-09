package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeTag;

@Schema(description = "노드 검색 응답")
public record SearchNodeResponse(
        @Schema(description = "검색된 노드 목록")
        List<SearchItem> nodes
) {

    public static SearchNodeResponse of(
            final List<Node> nodes,
            final Map<Long, List<NodeTag>> nodeTagMap
    ) {
        List<SearchItem> items = nodes.stream()
                .map(node -> SearchItem.from(
                        node,
                        nodeTagMap.getOrDefault(node.getId(), List.of())
                ))
                .toList();

        return new SearchNodeResponse(items);
    }

    @Schema(description = "검색된 노드 항목")
    public record SearchItem(
            @Schema(description = "노드 ID", example = "101")
            Long nodeId,
            @Schema(description = "노드 제목", example = "로그인 화면 기획")
            String title,
            @Schema(description = "노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "DONE"})
            String status,
            @Schema(description = "부여된 태그 목록")
            List<TagItem> tags
    ) {

        public static SearchItem from(final Node node, final List<NodeTag> nodeTags) {
            return new SearchItem(
                    node.getId(),
                    node.getTitle(),
                    node.getStatus().name(),
                    nodeTags.stream().map(nt -> TagItem.from(nt.getTag())).toList()
            );
        }
    }
}
