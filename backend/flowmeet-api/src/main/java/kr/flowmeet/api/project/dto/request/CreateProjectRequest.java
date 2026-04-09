package kr.flowmeet.api.project.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateProjectRequest(
        @NotBlank(message = "프로젝트 이름은 필수로 입력해 주세요.")
        String name
) {
}