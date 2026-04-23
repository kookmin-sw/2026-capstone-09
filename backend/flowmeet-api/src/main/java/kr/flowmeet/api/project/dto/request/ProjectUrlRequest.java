package kr.flowmeet.api.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "프로젝트 URL 등록/수정 요청")
public record ProjectUrlRequest(
        @Schema(description = "프로젝트에 연결할 URL", example = "https://github.com/kookmin-sw/2026-capstone-09")
        @NotBlank(message = ValidationMessage.PROJECT_URL_REQUIRED)
        String url
) {
}
