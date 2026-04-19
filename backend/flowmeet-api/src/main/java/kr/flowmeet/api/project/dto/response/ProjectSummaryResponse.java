package kr.flowmeet.api.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;

@Schema(description = "프로젝트 목록 요약 응답")
public record ProjectSummaryResponse(
        @Schema(description = "프로젝트 ID", example = "17")
        Long projectId,
        @Schema(description = "프로젝트 이름", example = "FlowMeet 리뉴얼")
        String name,
        @Schema(description = "프로젝트 멤버 수", example = "8")
        int memberCount,
        @Schema(description = "마지막 수정 시각", example = "2026-04-19T10:15:30")
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
