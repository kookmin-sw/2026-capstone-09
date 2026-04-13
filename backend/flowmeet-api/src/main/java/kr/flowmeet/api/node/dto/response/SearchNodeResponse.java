package kr.flowmeet.api.node.dto.response;

import java.util.List;
import java.util.Map;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.entity.Tag;

public record SearchNodeResponse(
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

    public record SearchItem(
            Long nodeId,
            String title,
            String status,
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
