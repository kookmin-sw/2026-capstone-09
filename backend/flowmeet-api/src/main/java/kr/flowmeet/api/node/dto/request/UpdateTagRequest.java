package kr.flowmeet.api.node.dto.request;

import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.domain.node.service.vo.UpdateTagCommand;

public record UpdateTagRequest(
        @NotBlank(message = "태그 이름은 필수입니다.")
        String name,
        @NotBlank(message = "태그 색상은 필수입니다.")
        String color
) {

    public UpdateTagCommand toCommand() {
        return new UpdateTagCommand(name, color);
    }
}
