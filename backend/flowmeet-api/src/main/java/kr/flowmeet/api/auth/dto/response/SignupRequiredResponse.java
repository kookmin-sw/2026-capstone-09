package kr.flowmeet.api.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.user.entity.SocialProvider;

@Schema(description = "회원가입 필요 응답")
public record SignupRequiredResponse(
        @Schema(description = "소셜 제공자", example = "GOOGLE")
        SocialProvider socialProvider,

        @Schema(description = "소셜 access token", example = "ya29.a0AfH6SMB...")
        String socialAccessToken,

        @Schema(description = "소셜 refresh token (회원가입 시 그대로 전달)", example = "1//0gLY...")
        String socialRefreshToken,

        @Schema(description = "소셜 계정의 표시 이름", example = "황수민")
        String name,

        @Schema(description = "소셜 계정 이메일", example = "tnals655@kookmin.ac.kr")
        String email
) {
    public static SignupRequiredResponse of(
            SocialProvider socialProvider,
            String socialAccessToken,
            String socialRefreshToken,
            String name,
            String email
    ) {
        return new SignupRequiredResponse(socialProvider, socialAccessToken, socialRefreshToken, name, email);
    }
}
