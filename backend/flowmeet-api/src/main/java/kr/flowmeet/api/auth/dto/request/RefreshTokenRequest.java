package kr.flowmeet.api.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "토큰 갱신 요청")
public record RefreshTokenRequest(
        @Schema(description = "Refresh Token", example = "eyJhbGciOiJIUzI1NiJ9...")
        @NotBlank(message = "리프레시 토큰은 필수로 입력해 주세요.")
        String refreshToken
) {
}
