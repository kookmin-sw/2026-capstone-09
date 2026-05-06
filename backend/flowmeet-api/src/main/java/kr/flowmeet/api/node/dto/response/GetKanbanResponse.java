package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.entity.NodeTag;

@Schema(description = "칸반 보드 조회 응답 (상태별 그룹핑)")
public record GetKanbanResponse(
        @Schema(description = "대기 상태의 노드 목록")
        List<KanbanItem> waiting,
        @Schema(description = "진행 중 상태의 노드 목록")
        List<KanbanItem> inProgress,
        @Schema(description = "완료 상태의 노드 목록")
        List<KanbanItem> done
) {

    public static GetKanbanResponse of(
            final Map<NodeStatus, List<Node>> statusMap,
            final Map<Long, List<NodeTag>> nodeTagMap,
            final Map<Long, List<NodeAssignee>> assigneeMap
    ) {
        return new GetKanbanResponse(
                toKanbanItems(statusMap.getOrDefault(NodeStatus.WAITING, List.of()), nodeTagMap, assigneeMap),
                toKanbanItems(statusMap.getOrDefault(NodeStatus.IN_PROGRESS, List.of()), nodeTagMap, assigneeMap),
                toKanbanItems(statusMap.getOrDefault(NodeStatus.DONE, List.of()), nodeTagMap, assigneeMap)
        );
    }

    private static List<KanbanItem> toKanbanItems(
            final List<Node> nodes,
            final Map<Long, List<NodeTag>> nodeTagMap,
            final Map<Long, List<NodeAssignee>> assigneeMap
    ) {
        return nodes.stream()
                .map(node -> KanbanItem.from(
                        node,
                        nodeTagMap.getOrDefault(node.getId(), List.of()),
                        assigneeMap.getOrDefault(node.getId(), List.of())
                ))
                .toList();
    }

    @Schema(description = "칸반 보드의 개별 노드 카드")
    public record KanbanItem(
            @Schema(description = "노드 ID", example = "101")
            Long nodeId,
            @Schema(description = "노드 번호 (노드 1번의 서브 노드라면 1.1)", example = "1.1")
            String number,
            @Schema(description = "노드 제목", example = "로그인 화면 기획")
            String title,
            @Schema(description = "같은 상태 내 정렬 순서", example = "1024")
            int sortOrder,
            @Schema(description = "부여된 태그 목록")
            List<TagItem> tags,
            @Schema(description = "담당자 목록")
            List<AssigneeItem> assignees,
            @Schema(description = "생성 시각", example = "2026-03-01T09:00:00")
            LocalDateTime createdAt,
            @Schema(description = "마지막 수정 시각", example = "2026-04-19T10:15:30")
            LocalDateTime updatedAt
    ) {

        public static KanbanItem from(
                final Node node,
                final List<NodeTag> nodeTags,
                final List<NodeAssignee> nodeAssignees
        ) {
            return new KanbanItem(
                    node.getId(),
                    node.getNumber(),
                    node.getTitle(),
                    node.getSortOrder(),
                    nodeTags.stream().map(nt -> TagItem.from(nt.getTag())).toList(),
                    nodeAssignees.stream().map(na -> AssigneeItem.from(na.getUser())).toList(),
                    node.getCreatedAt(),
                    node.getUpdatedAt()
            );
        }
    }
}
