package kr.flowmeet.api.chat.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Schema(description = "메시지 전송 요청")
public record SendMessageRequest(
        @Schema(description = "메시지 내용", example = "이 노드 내용을 기반으로 일정을 정리해줘")
        @NotBlank(message = "메시지 내용을 입력해 주세요.")
        String content,

        @Schema(description = "참조 노드 ID 목록", example = "[1, 2]")
        List<Long> referenceNodeIds,

        @Schema(description = "참조 사용자 ID 목록", example = "[3, 4]")
        List<Long> referenceUserIds
) {
}