package kr.flowmeet.domain.node.service.vo;

import kr.flowmeet.domain.node.entity.NodeStatus;

public record UpdateNodeStatusCommand(
        NodeStatus status,
        Integer sortOrder
) {
}