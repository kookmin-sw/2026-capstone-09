package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.entity.NodeTag;

@Schema(description = "노드 목록 조회 응답")
public record GetNodeListResponse(
        @Schema(description = "노드 목록")
        List<NodeListItem> nodes
) {

    public static GetNodeListResponse of(
            final List<Node> nodes,
            final Map<Long, List<NodeTag>> nodeTagMap,
            final Map<Long, List<NodeAssignee>> assigneeMap,
            final Set<Long> meetingNodeIds
    ) {
        List<NodeListItem> items = nodes.stream()
                .map(node -> NodeListItem.from(
                        node,
                        nodeTagMap.getOrDefault(node.getId(), List.of()),
                        assigneeMap.getOrDefault(node.getId(), List.of()),
                        meetingNodeIds.contains(node.getId())
                ))
                .toList();

        return new GetNodeListResponse(items);
    }

    @Schema(description = "노드 목록의 개별 항목")
    public record NodeListItem(
            @Schema(description = "노드 ID", example = "101")
            Long nodeId,
            @Schema(description = "노드 번호 (노드 1번의 서브 노드라면 1.1)", example = "1.1")
            String number,
            @Schema(description = "노드 제목", example = "로그인 화면 기획")
            String title,
            @Schema(description = "노드 설명", example = "OAuth2 로그인 플로우 정리")
            String description,
            @Schema(description = "노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "ON_HOLD", "DONE", "CLOSED"})
            String status,
            @Schema(description = "부여된 태그 목록")
            List<TagItem> tags,
            @Schema(description = "담당자 목록")
            List<AssigneeItem> assignees,
            @Schema(description = "연결된 회의 존재 여부", example = "true")
            boolean hasMeeting,
            @Schema(description = "마지막 수정 시각", example = "2026-04-19T10:15:30")
            LocalDateTime updatedAt
    ) {

        public static NodeListItem from(
                final Node node,
                final List<NodeTag> nodeTags,
                final List<NodeAssignee> nodeAssignees,
                final boolean hasMeeting
        ) {
            return new NodeListItem(
                    node.getId(),
                    node.getNumber(),
                    node.getTitle(),
                    node.getDescription(),
                    node.getStatus().name(),
                    nodeTags.stream().map(nt -> TagItem.from(nt.getTag())).toList(),
                    nodeAssignees.stream().map(AssigneeItem::from).toList(),
                    hasMeeting,
                    node.getUpdatedAt()
            );
        }
    }
}
