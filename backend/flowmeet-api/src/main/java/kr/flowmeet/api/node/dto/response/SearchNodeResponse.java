package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeTag;

@Schema(description = "노드 검색 응답")
public record SearchNodeResponse(
        @Schema(description = "검색된 노드 목록")
        List<SearchItem> nodes,
        long totalCount
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

        return new SearchNodeResponse(items, items.size());
    }

    @Schema(description = "검색된 노드 항목")
    public record SearchItem(
            @Schema(description = "노드 ID", example = "101")
            Long nodeId,
            @Schema(description = "노드 번호 (노드 1번의 서브 노드라면 1.1)", example = "1.1")
            String number,
            @Schema(description = "노드 제목", example = "로그인 화면 기획")
            String title,
            @Schema(description = "노드 설명", example = "OAuth2 로그인 플로우 정리")
            String description,
            @Schema(description = "노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "DONE"})
            String status,
            @Schema(description = "부여된 태그 목록")
            List<TagItem> tags,
            @Schema(description = "생성 시각", example = "2026-03-01T09:00:00")
            LocalDateTime createdAt,
            @Schema(description = "마지막 수정 시각", example = "2026-04-19T10:15:30")
            LocalDateTime updatedAt
    ) {

        public static SearchItem from(final Node node, final List<NodeTag> nodeTags) {
            return new SearchItem(
                    node.getId(),
                    node.getNumber(),
                    node.getTitle(),
                    node.getDescription(),
                    node.getStatus().name(),
                    nodeTags.stream().map(nt -> TagItem.from(nt.getTag())).toList(),
                    node.getCreatedAt(),
                    node.getUpdatedAt()
            );
        }
    }
}
