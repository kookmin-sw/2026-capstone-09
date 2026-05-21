package kr.flowmeet.api.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;

@Schema(description = "프로젝트 목록 요약 응답")
public record ProjectSummaryResponse(
        @Schema(description = "프로젝트 ID", example = "17")
        Long projectId,
        @Schema(description = "프로젝트 프로필 이미지 URL", example = "https://static.flowmeet.kr/projects/1.png")
        String profileImageUrl,
        @Schema(description = "프로젝트 이름", example = "FlowMeet 리뉴얼")
        String name,
        @Schema(description = "프로젝트 멤버 수", example = "8")
        int memberCount,
        @Schema(description = "마지막 활동 시각", example = "2026-04-19T10:15:30")
        LocalDateTime lastActivityAt
) {
    public static ProjectSummaryResponse from(final ProjectWithMemberCountProjection projection) {
        Project project = projection.project();
        return new ProjectSummaryResponse(
                project.getId(),
                project.getProfileImageUrl(),
                project.getName(),
                projection.memberCount().intValue(),
                project.getLastActivityAt()
        );
    }
}
