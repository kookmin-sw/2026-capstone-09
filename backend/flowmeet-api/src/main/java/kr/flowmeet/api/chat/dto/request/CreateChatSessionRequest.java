package kr.flowmeet.api.chat.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "채팅 세션 생성 요청")
public record CreateChatSessionRequest(
        @Schema(description = "채팅 제목 (미입력 시 자동 생성)", example = "기획 방향성 질문")
        String title,
        @Schema(description = "참조할 노드 ID 목록", example = "[101, 102]")
        List<Long> nodeIds
) {
}