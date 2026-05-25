package kr.flowmeet.api.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "프로젝트 생성 요청")
public record CreateProjectRequest(
        @Schema(description = "프로젝트 이름", example = "FlowMeet 리뉴얼")
        @NotBlank(message = ValidationMessage.PROJECT_NAME_REQUIRED)
        String name
) {
}
