package kr.flowmeet.api.node.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.user.entity.User;

public record GetNodeListResponse(
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

    public record NodeListItem(
            Long nodeId,
            String title,
            String description,
            String status,
            List<TagItem> tags,
            List<AssigneeItem> assignees,
            boolean hasMeeting,
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
                    node.getTitle(),
                    node.getDescription(),
                    node.getStatus().name(),
                    nodeTags.stream().map(nt -> TagItem.from(nt.getTag())).toList(),
                    nodeAssignees.stream().map(na -> AssigneeItem.from(na.getUser())).toList(),
                    hasMeeting,
                    node.getUpdatedAt()
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
