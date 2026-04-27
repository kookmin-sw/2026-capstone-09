package kr.flowmeet.domain.node.service.vo;

import kr.flowmeet.domain.node.entity.TagColor;

public record CreateTagCommand(
        String name,
        TagColor color
) {
}