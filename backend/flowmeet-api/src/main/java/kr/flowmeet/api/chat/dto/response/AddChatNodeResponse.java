package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.node.entity.Node;

@Schema(description = "참조 노드 추가 응답")
public record AddChatNodeResponse(
        @Schema(description = "채팅 세션 ID", example = "301")
        Long chatSessionId,
        @Schema(description = "추가된 참조 노드")
        ReferencedNodeResponse referencedNode
) {
    public static AddChatNodeResponse of(final Long chatSessionId, final Node node) {
        return new AddChatNodeResponse(chatSessionId, ReferencedNodeResponse.from(node));
    }
}