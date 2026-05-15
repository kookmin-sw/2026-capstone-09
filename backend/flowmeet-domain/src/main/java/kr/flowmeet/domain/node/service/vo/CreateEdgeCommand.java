package kr.flowmeet.domain.node.service.vo;

public record CreateEdgeCommand(
        Long startNodeId,
        Long endNodeId,
        String comment
) {
}
