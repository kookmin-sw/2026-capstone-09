package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.chat.entity.ChatSession;

@Schema(description = "채팅 제목 수정 응답")
public record UpdateChatSessionResponse(
        @Schema(description = "채팅 세션 ID", example = "301")
        Long chatSessionId,
        @Schema(description = "변경된 채팅 제목", example = "수정된 채팅 제목")
        String title
) {
    public static UpdateChatSessionResponse from(final ChatSession session) {
        return new UpdateChatSessionResponse(session.getId(), session.getTitle());
    }
}