package kr.flowmeet.api.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "프로젝트 수정 요청")
public record UpdateProjectRequest(
        @Schema(description = "변경할 프로젝트 이름", example = "FlowMeet v2")
        @NotBlank(message = ValidationMessage.PROJECT_NAME_REQUIRED)
        String name
) {
}
