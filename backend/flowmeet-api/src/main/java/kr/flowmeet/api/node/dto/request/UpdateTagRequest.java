package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.domain.node.service.vo.UpdateTagCommand;

@Schema(description = "태그 수정 요청")
public record UpdateTagRequest(
        @Schema(description = "변경할 태그 이름", example = "매우 긴급")
        @NotBlank(message = "태그 이름은 필수입니다.")
        String name,
        @Schema(description = "변경할 태그 색상(HEX)", example = "#FF0000")
        @NotBlank(message = "태그 색상은 필수입니다.")
        String color
) {

    public UpdateTagCommand toCommand() {
        return new UpdateTagCommand(name, color);
    }
}
