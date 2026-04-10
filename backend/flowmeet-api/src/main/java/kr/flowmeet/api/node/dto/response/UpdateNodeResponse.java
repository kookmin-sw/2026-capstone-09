package kr.flowmeet.api.node.dto.response;

import java.time.LocalDateTime;
import kr.flowmeet.domain.node.entity.Node;

public record UpdateNodeResponse(
        Long nodeId,
        String title,
        String description,
        String noteContent,
        String status,
        int sortOrder,
        LocalDateTime updatedAt
) {

    public static UpdateNodeResponse from(final Node node) {
        return new UpdateNodeResponse(
                node.getId(),
                node.getTitle(),
                node.getDescription(),
                node.getNoteContent(),
                node.getStatus().name(),
                node.getSortOrder(),
                node.getUpdatedAt()
        );
    }
}
