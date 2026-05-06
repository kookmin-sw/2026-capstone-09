package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.user.entity.User;

@Schema(description = "플로우차트 조회 응답 (노드와 연결선)")
public record GetFlowchartResponse(
        @Schema(description = "노드 목록")
        List<NodeItem> nodes,
        @Schema(description = "노드 간 연결선 목록")
        List<EdgeItem> edges
) {

    public static GetFlowchartResponse of(
            final List<Node> nodes,
            final List<Edge> edges,
            final Map<Long, List<NodeTag>> nodeTagMap,
            final Map<Long, List<NodeAssignee>> assigneeMap,
            final Set<Long> meetingNodeIds,
            final Map<Long, List<Long>> childMap
    ) {
        List<NodeItem> nodeItems = nodes.stream()
                .map(node -> NodeItem.from(
                        node,
                        nodeTagMap.getOrDefault(node.getId(), List.of()),
                        assigneeMap.getOrDefault(node.getId(), List.of()),
                        meetingNodeIds.contains(node.getId()),
                        childMap.getOrDefault(node.getId(), List.of())
                ))
                .toList();

        List<EdgeItem> edgeItems = edges.stream()
                .map(EdgeItem::from)
                .toList();

        return new GetFlowchartResponse(nodeItems, edgeItems);
    }

    @Schema(description = "플로우차트의 노드 항목")
    public record NodeItem(
            @Schema(description = "노드 ID", example = "101")
            Long nodeId,
            @Schema(description = "상위 노드 ID (메인인 경우 null)", example = "100")
            Long parentId,
            @Schema(description = "노드 번호 (노드 1번의 서브 노드라면 1.1)", example = "1.1")
            String number,
            @Schema(description = "노드 제목", example = "로그인 화면 기획")
            String title,
            @Schema(description = "노드 설명", example = "OAuth2 로그인 플로우 정리")
            String description,
            @Schema(description = "노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "DONE"})
            String status,
            @Schema(description = "같은 상태 내 정렬 순서", example = "1024")
            int sortOrder,
            @Schema(description = "부여된 태그 목록")
            List<TagItem> tags,
            @Schema(description = "담당자 목록")
            List<AssigneeItem> assignees,
            @Schema(description = "연결된 회의 존재 여부", example = "true")
            boolean hasMeeting,
            @Schema(description = "하위 노드 ID 목록", example = "[110, 111]")
            List<Long> childNodeIds,
            @Schema(description = "마지막 수정 시각", example = "2026-04-19T10:15:30")
            LocalDateTime updatedAt
    ) {

        public static NodeItem from(
                final Node node,
                final List<NodeTag> nodeTags,
                final List<NodeAssignee> nodeAssignees,
                final boolean hasMeeting,
                final List<Long> childNodeIds
        ) {
            return new NodeItem(
                    node.getId(),
                    node.getParentId(),
                    node.getNumber(),
                    node.getTitle(),
                    node.getDescription(),
                    node.getStatus().name(),
                    node.getSortOrder(),
                    nodeTags.stream().map(nt -> TagItem.from(nt.getTag())).toList(),
                    nodeAssignees.stream().map(na -> AssigneeItem.from(na.getUser())).toList(),
                    hasMeeting,
                    childNodeIds,
                    node.getUpdatedAt()
            );
        }
    }

    @Schema(description = "노드 간 연결선 항목")
    public record EdgeItem(
            @Schema(description = "연결선 ID", example = "9001")
            Long edgeId,
            @Schema(description = "시작 노드 ID", example = "101")
            Long startNodeId,
            @Schema(description = "종료 노드 ID", example = "102")
            Long endNodeId,
            @Schema(description = "연결선을 생성한 사용자 정보")
            EdgeCreatorItem createdBy,
            @Schema(description = "연결선 설명", example = "로그인 성공 시 대시보드로 이동")
            String comment,
            @Schema(description = "연결선 생성 시각", example = "2026-04-19T10:15:30")
            LocalDateTime createdAt
    ) {

        public static EdgeItem from(final Edge edge) {
            return new EdgeItem(
                    edge.getId(),
                    edge.getStartNodeId(),
                    edge.getEndNodeId(),
                    EdgeCreatorItem.from(edge.getCreatedBy()),
                    edge.getComment(),
                    edge.getCreatedAt()
            );
        }

        @Schema(description = "연결선 생성자 정보")
        public record EdgeCreatorItem(
                @Schema(description = "사용자 ID", example = "91")
                Long userId,
                @Schema(description = "닉네임", example = "플로우민")
                String nickname,
                @Schema(description = "이메일", example = "flowmin@flowmeet.kr")
                String email,
                @Schema(description = "프로필 이미지 URL", example = "https://static.flowmeet.kr/profile/91.png")
                String profileImageUrl
        ) {

            public static EdgeCreatorItem from(final User user) {
                return new EdgeCreatorItem(
                        user.getId(),
                        user.getNickname(),
                        user.getEmail(),
                        user.getProfileImageUrl()
                );
            }
        }
    }
}
