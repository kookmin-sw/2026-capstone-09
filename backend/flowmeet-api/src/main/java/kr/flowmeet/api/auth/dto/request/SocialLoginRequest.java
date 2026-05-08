package kr.flowmeet.api.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "소셜 로그인 요청")
public record SocialLoginRequest(
        @Schema(description = "소셜 로그인 인증 코드", example = "4/0AX4XfWjLkLi...")
        @NotBlank(message = "인증 코드는 필수로 입력해 주세요.")
        String code,

        @Schema(description = "SPA 측에서 사용한 redirect URI (provider 에 등록된 값과 동일해야 합니다)",
                example = "https://app.flowmeet.kr/auth/callback")
        @NotBlank(message = "redirect URI는 필수로 입력해 주세요.")
        String redirectUri
) {
}
