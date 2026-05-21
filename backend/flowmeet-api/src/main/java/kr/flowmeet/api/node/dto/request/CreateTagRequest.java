package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.api.common.validation.ValidationMessage;
import kr.flowmeet.domain.node.entity.TagColor;
import kr.flowmeet.domain.node.service.vo.CreateTagCommand;

@Schema(description = "태그 생성 요청")
public record CreateTagRequest(
        @Schema(description = "태그 이름", example = "긴급")
        @NotBlank(message = ValidationMessage.TAG_NAME_REQUIRED)
        String name,
        @Schema(description = "태그 색상", example = "RED")
        @NotNull(message = ValidationMessage.TAG_COLOR_REQUIRED)
        TagColor color
) {

    public CreateTagCommand toCommand() {
        return new CreateTagCommand(name, color);
    }
}
