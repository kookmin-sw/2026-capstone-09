package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.chat.entity.ChatSession;

@Schema(description = "채팅 세션 요약 응답")
public record ChatSessionSummaryResponse(
        @Schema(description = "채팅 세션 ID", example = "301")
        Long chatSessionId,
        @Schema(description = "채팅 제목", example = "기획 문서 피드백 요청")
        String title
) {
    public static ChatSessionSummaryResponse from(final ChatSession session) {
        return new ChatSessionSummaryResponse(
                session.getId(),
                session.getTitle()
        );
    }
}