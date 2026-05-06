package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatSession;
import kr.flowmeet.domain.node.entity.Node;

@Schema(description = "채팅 세션 생성 응답")
public record CreateChatSessionResponse(
        @Schema(description = "채팅 세션 ID", example = "301")
        Long chatSessionId,
        @Schema(description = "채팅 제목", example = "기획 방향성 질문")
        String title,
        @Schema(description = "참조 노드 목록")
        List<ReferencedNodeResponse> referencedNodes,
        @Schema(description = "생성 시각", example = "2026-04-19T10:00:00")
        LocalDateTime createdAt
) {
    public static CreateChatSessionResponse of(final ChatSession session, final List<Node> nodes) {
        return new CreateChatSessionResponse(
                session.getId(),
                session.getTitle(),
                nodes.stream().map(ReferencedNodeResponse::from).toList(),
                session.getCreatedAt()
        );
    }
}