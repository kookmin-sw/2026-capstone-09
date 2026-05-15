package kr.flowmeet.api.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "이메일 인증 코드 검증 요청")
public record VerifyEmailRequest(
        @Schema(description = "인증할 이메일", example = "flowmin@flowmeet.kr")
        @NotBlank(message = ValidationMessage.EMAIL_REQUIRED)
        @Email(message = ValidationMessage.EMAIL_INVALID)
        String email,
        @Schema(description = "인증 코드", example = "123456")
        @NotBlank(message = ValidationMessage.EMAIL_VERIFICATION_CODE_REQUIRED)
        String code
) {
}
