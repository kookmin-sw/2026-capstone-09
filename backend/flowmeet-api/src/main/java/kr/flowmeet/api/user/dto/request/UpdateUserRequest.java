package kr.flowmeet.api.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(max = 20, message = "닉네임은 최대 20자까지 입력할 수 있습니다.")
        @NotBlank(message = "닉네임은 필수로 입력해 주세요.")
        String nickname,
        @Email(message = "유효하지 않은 이메일 형식입니다.")
        String email
) {
}