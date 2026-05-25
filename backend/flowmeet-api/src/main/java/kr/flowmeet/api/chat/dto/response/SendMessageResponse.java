package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.chat.entity.ChatMessage;
import kr.flowmeet.domain.chat.entity.ChatMessageType;

@Schema(description = "메시지 전송 응답")
public record SendMessageResponse(
        @Schema(description = "메시지 ID", example = "5001")
        Long messageId,
        @Schema(description = "메시지 내용")
        String content,
        @Schema(description = "메시지 타입", example = "USER")
        ChatMessageType messageType,
        @Schema(description = "생성 시각", example = "2026-04-19T10:05:00")
        LocalDateTime createdAt
) {
    public static SendMessageResponse from(final ChatMessage message) {
        return new SendMessageResponse(
                message.getId(),
                message.getContent(),
                message.getMessageType(),
                message.getCreatedAt()
        );
    }
}