package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.api.common.validation.ValidationMessage;
import kr.flowmeet.domain.node.entity.TagColor;
import kr.flowmeet.domain.node.service.vo.UpdateTagCommand;

@Schema(description = "태그 수정 요청")
public record UpdateTagRequest(
        @Schema(description = "변경할 태그 이름", example = "매우 긴급")
        @NotBlank(message = ValidationMessage.TAG_NAME_REQUIRED)
        String name,
        @Schema(description = "변경할 태그 색상", example = "RED")
        @NotNull(message = ValidationMessage.TAG_COLOR_REQUIRED)
        TagColor color
) {

    public UpdateTagCommand toCommand() {
        return new UpdateTagCommand(name, color);
    }
}
