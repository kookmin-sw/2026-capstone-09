package kr.flowmeet.api.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.project.entity.Project;

@Schema(description = "프로젝트 생성 응답")
public record CreateProjectResponse(
        @Schema(description = "생성된 프로젝트 ID", example = "17")
        Long projectId,
        @Schema(description = "프로젝트 이름", example = "FlowMeet 리뉴얼")
        String name,
        @Schema(description = "생성 시각", example = "2026-04-19T10:15:30")
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
