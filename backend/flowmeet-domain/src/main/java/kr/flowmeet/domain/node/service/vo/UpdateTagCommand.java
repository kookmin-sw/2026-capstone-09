package kr.flowmeet.domain.node.service.vo;

import kr.flowmeet.domain.node.entity.TagColor;

public record UpdateTagCommand(
        String name,
        TagColor color
) {
}
