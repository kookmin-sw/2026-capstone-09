package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.chat.entity.ChatMessage;
import kr.flowmeet.domain.chat.entity.ChatSession;

@Schema(description = "새 채팅 시작 응답")
public record StartChatResponse(
        @Schema(description = "채팅 세션 ID", example = "301")
        Long chatSessionId,
        @Schema(description = "AI가 생성한 채팅 제목", example = "프로젝트 노드 정리 요청")
        String title,
        @Schema(description = "AI 응답 메시지")
        String aiResponse,
        @Schema(description = "생성 시각", example = "2026-04-19T10:00:00")
        LocalDateTime createdAt
) {
    public static StartChatResponse of(final ChatSession session, final ChatMessage aiMessage) {
        return new StartChatResponse(
                session.getId(),
                session.getTitle(),
                aiMessage.getContent(),
                session.getCreatedAt()
        );
    }
}