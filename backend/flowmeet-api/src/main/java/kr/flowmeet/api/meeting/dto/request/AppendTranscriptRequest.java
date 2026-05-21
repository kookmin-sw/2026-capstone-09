package kr.flowmeet.api.meeting.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "자막 저장 요청")
public record AppendTranscriptRequest(
        @Schema(description = "자막 텍스트", example = "플로우: 네, 다들 시간 맞춰주셔서 감사합니다.")
        @NotBlank(message = "자막 내용은 필수로 입력해 주세요.")
        String content
) {
}