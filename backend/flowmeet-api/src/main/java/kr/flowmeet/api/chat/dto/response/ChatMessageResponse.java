package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.chat.entity.ChatMessage;
import kr.flowmeet.domain.chat.entity.ChatMessageType;

@Schema(description = "채팅 메시지 응답")
public record ChatMessageResponse(
        @Schema(description = "메시지 ID", example = "5001")
        Long messageId,
        @Schema(description = "메시지 내용")
        String content,
        @Schema(description = "메시지 타입", example = "USER")
        ChatMessageType messageType,
        @Schema(description = "액션 데이터 (AI_ACTION 타입만)")
        String actionData,
        @Schema(description = "생성 시각", example = "2026-04-19T10:01:00")
        LocalDateTime createdAt
) {
    public static ChatMessageResponse from(final ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getContent(),
                message.getMessageType(),
                message.getActionData(),
                message.getCreatedAt()
        );
    }
}