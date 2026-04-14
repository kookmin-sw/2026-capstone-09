package kr.flowmeet.api.node.dto.response;

import java.util.List;
import java.util.Map;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.user.entity.User;

public record GetKanbanResponse(
        List<KanbanItem> waiting,
        List<KanbanItem> inProgress,
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

    public record KanbanItem(
            Long nodeId,
            String title,
            int sortOrder,
            List<TagItem> tags,
            List<AssigneeItem> assignees
    ) {

        public static KanbanItem from(
                final Node node,
                final List<NodeTag> nodeTags,
                final List<NodeAssignee> nodeAssignees
        ) {
            return new KanbanItem(
                    node.getId(),
                    node.getTitle(),
                    node.getSortOrder(),
                    nodeTags.stream().map(nt -> TagItem.from(nt.getTag())).toList(),
                    nodeAssignees.stream().map(na -> AssigneeItem.from(na.getUser())).toList()
            );
        }
    }
}
