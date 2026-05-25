package kr.flowmeet.api.chat.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Schema(description = "새 채팅 시작 요청")
public record StartChatRequest(
        @Schema(description = "첫 메시지 내용", example = "이 프로젝트 노드들을 정리해줘")
        @NotBlank(message = "메시지 내용을 입력해 주세요.")
        String content,

        @Schema(description = "참조할 노드 ID 목록", example = "[101, 102]")
        List<Long> nodeIds,

        @Schema(description = "참조 사용자 ID 목록", example = "[3, 4]")
        List<Long> referenceUserIds
) {
}