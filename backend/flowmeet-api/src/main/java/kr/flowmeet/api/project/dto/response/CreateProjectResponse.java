package kr.flowmeet.api.project.dto.response;

import java.time.LocalDateTime;
import kr.flowmeet.domain.project.entity.Project;

public record CreateProjectResponse(
        Long projectId,
        String name,
        LocalDateTime createdAt
) {
    public static CreateProjectResponse from(final Project project) {
        return new CreateProjectResponse(
                project.getId(),
                project.getName(),
                project.getCreatedAt()
        );
    }
}