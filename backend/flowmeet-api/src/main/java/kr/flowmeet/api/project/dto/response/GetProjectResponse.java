package kr.flowmeet.api.project.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.entity.ProjectUrl;

public record GetProjectResponse(
        Long projectId,
        String name,
        ProjectMemberRole myRole,
        int memberCount,
        List<UrlItem> urls,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static GetProjectResponse of(final Project project, final ProjectMemberRole myRole,
                                        final int memberCount, final List<ProjectUrl> urls) {
        return new GetProjectResponse(
                project.getId(),
                project.getName(),
                myRole,
                memberCount,
                urls.stream().map(UrlItem::from).toList(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }

    public record UrlItem(
            Long urlId,
            String url
    ) {
        public static UrlItem from(final ProjectUrl projectUrl) {
            return new UrlItem(projectUrl.getId(), projectUrl.getUrl());
        }
    }
}