package kr.flowmeet.api.project.dto.response;

import java.time.LocalDateTime;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;

public record ProjectSummaryResponse(
        Long projectId,
        String name,
        int memberCount,
        LocalDateTime updatedAt
) {
    public static ProjectSummaryResponse from(final ProjectWithMemberCountProjection projection) {
        Project project = projection.project();
        return new ProjectSummaryResponse(
                project.getId(),
                project.getName(),
                projection.memberCount().intValue(),
                project.getUpdatedAt()
        );
    }
}
