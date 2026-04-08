package kr.flowmeet.api.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(max = 20, message = "닉네임은 최대 20자까지 입력할 수 있습니다.")
        @Pattern(regexp = ".*\\S.*", message = "닉네임은 공백만으로 이루어질 수 없습니다.")
        String nickname,
        @Email(message = "유효하지 않은 이메일 형식입니다.")
        String secondaryEmail
) {
}