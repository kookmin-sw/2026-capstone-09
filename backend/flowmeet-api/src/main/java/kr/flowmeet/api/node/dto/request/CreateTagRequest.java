package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.domain.node.service.vo.CreateTagCommand;

@Schema(description = "태그 생성 요청")
public record CreateTagRequest(
        @Schema(description = "태그 이름", example = "긴급")
        @NotBlank(message = "태그 이름은 필수입니다.")
        String name,
        @Schema(description = "태그 색상(HEX)", example = "#FF5A5F")
        @NotBlank(message = "태그 색상은 필수입니다.")
        String color
) {

    public CreateTagCommand toCommand() {
        return new CreateTagCommand(name, color);
    }
}
