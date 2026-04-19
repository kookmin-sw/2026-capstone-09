package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.service.vo.UpdateNodeCommand;

@Schema(description = "노드 수정 요청 (변경할 필드만 전달)")
public record UpdateNodeRequest(
        @Schema(description = "변경할 제목", example = "로그인 화면 기획 (v2)")
        String title,
        @Schema(description = "변경할 설명", example = "OAuth2 로그인 플로우 정리 및 와이어프레임 첨부")
        String description,
        @Schema(description = "변경할 노트 내용(마크다운)", example = "## 로그인 시나리오\n- Google OAuth ...")
        String noteContent,
        @Schema(description = "변경할 노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "DONE"})
        NodeStatus status,
        @Schema(description = "칸반 내 정렬 순서", example = "1024")
        Integer sortOrder
) {

    public UpdateNodeCommand toCommand() {
        return new UpdateNodeCommand(title, description, noteContent, status, sortOrder);
    }
}
