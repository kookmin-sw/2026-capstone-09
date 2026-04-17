package kr.flowmeet.domain.node.service.vo;

import kr.flowmeet.domain.node.entity.NodeType;

public record CreateNodeCommand(
        String title,
        String description,
        NodeType type,
        Long parentId
) {
}
