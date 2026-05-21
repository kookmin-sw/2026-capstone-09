package kr.flowmeet.api.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.api.common.validation.ValidationMessage;

@Schema(description = "회원가입 이메일 인증 코드 발송 요청")
public record SendAuthEmailVerificationRequest(
        @Schema(description = "인증할 이메일", example = "flowmin@flowmeet.kr")
        @NotBlank(message = ValidationMessage.EMAIL_REQUIRED)
        @Email(message = ValidationMessage.EMAIL_INVALID)
        String email
) {
}
