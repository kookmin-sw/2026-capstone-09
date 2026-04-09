package kr.flowmeet.api.project.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ProjectUrlRequest(
        @NotBlank(message = "URL은 필수로 입력해 주세요.")
        String url
) {
}