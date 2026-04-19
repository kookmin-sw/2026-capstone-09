package kr.flowmeet.api.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "내 정보 수정 요청")
public record UpdateUserRequest(
        @Schema(description = "닉네임(최대 20자)", example = "플로우민", maxLength = 20)
        @Size(max = 20, message = "닉네임은 최대 20자까지 입력할 수 있습니다.")
        @NotBlank(message = "닉네임은 필수로 입력해 주세요.")
        String nickname,
        @Schema(description = "이메일", example = "flowmin@flowmeet.kr")
        @Email(message = "유효하지 않은 이메일 형식입니다.")
        String email
) {
}
