package kr.flowmeet.api.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kr.flowmeet.api.common.validation.ValidationMessage;
import kr.flowmeet.domain.user.entity.SocialProvider;

@Schema(description = "회원가입 요청")
public record SignupRequest(
        @Schema(description = "소셜 제공자", example = "GOOGLE")
        @NotNull(message = "소셜 제공자는 필수로 입력해 주세요.")
        SocialProvider socialProvider,

        @Schema(description = "소셜 access token (로그인 응답으로 받은 값)", example = "ya29.a0AfH6SMB...")
        @NotBlank(message = "소셜 access token은 필수로 입력해 주세요.")
        String socialAccessToken,

        @Schema(description = "소셜 refresh token (로그인 응답으로 받은 값, 없으면 null)", example = "1//0gLY...")
        String socialRefreshToken,

        @Schema(description = "닉네임(최대 20자)", example = "수민")
        @NotBlank(message = ValidationMessage.NICKNAME_REQUIRED)
        @Size(max = 20, message = ValidationMessage.NICKNAME_MAX_LENGTH)
        String nickname,

        @Schema(description = "이메일", example = "tnals655@kookmin.ac.kr")
        @NotBlank(message = ValidationMessage.EMAIL_REQUIRED)
        @Email(message = ValidationMessage.EMAIL_INVALID)
        String email
) {
}
