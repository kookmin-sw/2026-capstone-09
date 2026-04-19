package kr.flowmeet.api.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.project.entity.ProjectUrl;

@Schema(description = "프로젝트 URL 응답")
public record ProjectUrlResponse(
        @Schema(description = "URL ID", example = "3")
        Long urlId,
        @Schema(description = "URL 값", example = "https://github.com/kookmin-sw/2026-capstone-09")
        String url
) {
    public static ProjectUrlResponse from(final ProjectUrl projectUrl) {
        return new ProjectUrlResponse(projectUrl.getId(), projectUrl.getUrl());
    }
}
