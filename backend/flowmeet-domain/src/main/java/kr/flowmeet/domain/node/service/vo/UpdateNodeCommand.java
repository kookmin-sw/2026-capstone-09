package kr.flowmeet.domain.node.service.vo;

import kr.flowmeet.domain.node.entity.NodeStatus;

public record UpdateNodeCommand(
        String title,
        String description,
        String noteContent,
        NodeStatus status,
        Integer sortOrder
) {
}