package kr.flowmeet.api.node.dto.request;

import kr.flowmeet.domain.node.entity.NodeStatus;

public record UpdateNodeRequest(
        String title,
        String description,
        String noteContent,
        NodeStatus status,
        Integer sortOrder
) {
}
