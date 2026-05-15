package kr.flowmeet.api.chat.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "채팅 제목 수정 요청")
public record UpdateChatSessionRequest(
        @Schema(description = "변경할 채팅 제목", example = "수정된 채팅 제목")
        @NotBlank(message = "채팅 제목을 입력해 주세요.")
        String title
) {
}