package kr.flowmeet.api.node.dto.response;

import java.time.LocalDateTime;
import kr.flowmeet.domain.node.entity.Node;

public record UpdateNodeStatusResponse(
        Long nodeId,
        String status,
        int sortOrder,
        LocalDateTime updatedAt
) {

    public static UpdateNodeStatusResponse from(final Node node) {
        return new UpdateNodeStatusResponse(
                node.getId(),
                node.getStatus().name(),
                node.getSortOrder(),
                node.getUpdatedAt()
        );
    }
}
