package kr.flowmeet.api.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "프로젝트 멤버 초대 요청")
public record InviteProjectMemberRequest(
        @Schema(description = "초대할 사용자 이메일", example = "teammate@flowmeet.kr")
        @NotBlank(message = "이메일은 필수로 입력해 주세요.")
        @Email(message = "유효하지 않은 이메일 형식입니다.")
        String email
) {
}
