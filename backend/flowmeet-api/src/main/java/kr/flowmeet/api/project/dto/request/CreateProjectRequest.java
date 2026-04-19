package kr.flowmeet.api.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "프로젝트 생성 요청")
public record CreateProjectRequest(
        @Schema(description = "프로젝트 이름", example = "FlowMeet 리뉴얼")
        @NotBlank(message = "프로젝트 이름은 필수로 입력해 주세요.")
        String name
) {
}
