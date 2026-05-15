package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "노드 노트 수정 요청")
public record UpdateNodeNoteRequest(
        @Schema(description = "변경할 노트 내용(마크다운)", example = "## 로그인 시나리오\n- Google OAuth ...")
        String noteContent
) {
}
