package kr.flowmeet.domain.node.service.vo;

public record CreateTagCommand(
        String name,
        String color
) {
}