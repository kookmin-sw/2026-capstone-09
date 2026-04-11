package kr.flowmeet.api.user.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileImageRequest(
        @NotBlank(message = "파일 키는 필수로 입력해 주세요.")
        String fileKey
) {
}
