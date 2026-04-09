package kr.flowmeet.api.project.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InviteProjectMemberRequest(
        @NotBlank(message = "이메일은 필수로 입력해 주세요.")
        @Email(message = "유효하지 않은 이메일 형식입니다.")
        String email
) {
}