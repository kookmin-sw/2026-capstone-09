package kr.flowmeet.api.project.dto;

import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.project.entity.Project;

public record GetAllProjectsResponse(
        List<ProjectItem> projects,
        long totalElements,
        int totalPages,
        int currentPage,
        int size
) {
    public static GetAllProjectsResponse of(final List<ProjectItem> projects, final long totalElements,
                                            final int totalPages, final int currentPage, final int size) {
        return new GetAllProjectsResponse(projects, totalElements, totalPages, currentPage, size);
    }

    public record ProjectItem(
            Long projectId,
            String name,
            int memberCount,
            LocalDateTime updatedAt
    ) {
        public static ProjectItem of(final Project project, final int memberCount) {
            return new ProjectItem(
                    project.getId(),
                    project.getName(),
                    memberCount,
                    project.getUpdatedAt()
            );
        }
    }
}
