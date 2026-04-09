package kr.flowmeet.api.project.dto.response;

import kr.flowmeet.domain.project.entity.ProjectUrl;

public record ProjectUrlResponse(
        Long urlId,
        String url
) {
    public static ProjectUrlResponse from(final ProjectUrl projectUrl) {
        return new ProjectUrlResponse(projectUrl.getId(), projectUrl.getUrl());
    }
}