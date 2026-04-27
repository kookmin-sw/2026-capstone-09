package kr.flowmeet.api.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "내 정보 수정 요청")
public record UpdateUserRequest(
        @Schema(description = "닉네임(최대 20자)", example = "플로우민", maxLength = 20)
        @Size(max = 20, message = ValidationMessage.NICKNAME_MAX_LENGTH)
        @NotBlank(message = ValidationMessage.NICKNAME_REQUIRED)
        String nickname,
        @Schema(description = "이메일", example = "flowmin@flowmeet.kr")
        @Email(message = ValidationMessage.EMAIL_INVALID)
        String email
) {
}
