package kr.flowmeet.api.node.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateTagRequest(
        @NotBlank(message = "태그 이름은 필수입니다.")
        String name,
        @NotBlank(message = "태그 색상은 필수입니다.")
        String color
) {
}
