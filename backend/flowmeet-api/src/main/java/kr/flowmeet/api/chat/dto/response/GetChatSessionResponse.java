package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import kr.flowmeet.domain.chat.entity.ChatSession;
import kr.flowmeet.domain.node.entity.Node;

@Schema(description = "채팅 상세 조회 응답")
public record GetChatSessionResponse(
        @Schema(description = "채팅 세션 ID", example = "301")
        Long chatSessionId,
        @Schema(description = "채팅 제목", example = "기획 문서 피드백 요청")
        String title,
        @Schema(description = "참조 노드 목록")
        List<ReferencedNodeResponse> referencedNodes,
        @Schema(description = "메시지 목록")
        List<ChatMessageResponse> messages,
        @Schema(description = "다음 페이지 존재 여부", example = "false")
        boolean hasNext
) {
    public static GetChatSessionResponse of(
            final ChatSession session,
            final List<Node> nodes,
            final List<ChatMessageResponse> messages,
            final boolean hasNext
    ) {
        return new GetChatSessionResponse(
                session.getId(),
                session.getTitle(),
                nodes.stream().map(ReferencedNodeResponse::from).toList(),
                messages,
                hasNext
        );
    }
}