package kr.flowmeet.api.node.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.user.entity.User;

public record GetFlowchartResponse(
        List<NodeItem> nodes,
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

    public record NodeItem(
            Long nodeId,
            Long parentId,
            String title,
            String description,
            String status,
            int sortOrder,
            List<TagItem> tags,
            List<AssigneeItem> assignees,
            boolean hasMeeting,
            List<Long> childNodeIds,
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

    public record EdgeItem(
            Long edgeId,
            Long startNodeId,
            Long endNodeId,
            String comment
    ) {

        public static EdgeItem from(final Edge edge) {
            return new EdgeItem(
                    edge.getId(),
                    edge.getStartNodeId(),
                    edge.getEndNodeId(),
                    edge.getComment()
            );
        }
    }

    public record TagItem(
            Long tagId,
            String name,
            String color
    ) {

        public static TagItem from(final Tag tag) {
            return new TagItem(tag.getId(), tag.getName(), tag.getColor());
        }
    }

    public record AssigneeItem(
            Long userId,
            String nickname,
            String profileImageUrl
    ) {

        public static AssigneeItem from(final User user) {
            return new AssigneeItem(user.getId(), user.getNickname(), user.getProfileImageUrl());
        }
    }
}
