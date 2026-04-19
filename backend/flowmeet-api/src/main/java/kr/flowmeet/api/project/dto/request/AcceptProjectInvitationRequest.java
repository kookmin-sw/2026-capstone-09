package kr.flowmeet.api.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "프로젝트 초대 수락 요청")
public record AcceptProjectInvitationRequest(
        @Schema(description = "초대 메일 링크에 포함된 JWT 토큰")
        @NotBlank(message = "초대 토큰은 필수로 입력해 주세요.")
        String token
) {
}
