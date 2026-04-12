package kr.flowmeet.api.node.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateEdgeRequest(
        @NotNull(message = "시작 노드 ID는 필수입니다.")
        Long startNodeId,
        @NotNull(message = "종료 노드 ID는 필수입니다.")
        Long endNodeId
) {
}
