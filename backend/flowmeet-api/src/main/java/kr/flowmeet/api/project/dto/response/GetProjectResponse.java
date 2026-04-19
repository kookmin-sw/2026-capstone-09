package kr.flowmeet.api.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.entity.ProjectUrl;

@Schema(description = "프로젝트 상세 조회 응답")
public record GetProjectResponse(
        @Schema(description = "프로젝트 ID", example = "17")
        Long projectId,
        @Schema(description = "프로젝트 이름", example = "FlowMeet 리뉴얼")
        String name,
        @Schema(description = "내 권한", example = "OWNER", allowableValues = {"VIEWER", "MEMBER", "OWNER"})
        ProjectMemberRole myRole,
        @Schema(description = "프로젝트 멤버 수", example = "8")
        int memberCount,
        @Schema(description = "프로젝트에 등록된 URL 목록")
        List<UrlItem> urls,
        @Schema(description = "생성 시각", example = "2026-03-01T09:00:00")
        LocalDateTime createdAt,
        @Schema(description = "마지막 수정 시각", example = "2026-04-19T10:15:30")
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

    @Schema(description = "프로젝트에 등록된 URL 항목")
    public record UrlItem(
            @Schema(description = "URL ID", example = "3")
            Long urlId,
            @Schema(description = "URL 값", example = "https://github.com/kookmin-sw/2026-capstone-09")
            String url
    ) {
        public static UrlItem from(final ProjectUrl projectUrl) {
            return new UrlItem(projectUrl.getId(), projectUrl.getUrl());
        }
    }
}
