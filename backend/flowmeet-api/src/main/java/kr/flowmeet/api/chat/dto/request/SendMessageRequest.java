package kr.flowmeet.api.chat.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "메시지 전송 요청")
public record SendMessageRequest(
        @Schema(description = "메시지 내용", example = "이 노드 내용을 기반으로 일정을 정리해줘")
        @NotBlank(message = "메시지 내용을 입력해 주세요.")
        String content
) {
}