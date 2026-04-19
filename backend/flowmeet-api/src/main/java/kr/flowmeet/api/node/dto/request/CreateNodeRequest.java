package kr.flowmeet.api.node.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.domain.node.entity.NodeType;
import kr.flowmeet.domain.node.service.vo.CreateNodeCommand;

@Schema(description = "노드 생성 요청")
public record CreateNodeRequest(
        @Schema(description = "노드 제목", example = "로그인 화면 기획")
        @NotBlank(message = "노드 제목은 필수로 입력해 주세요.")
        String title,
        @Schema(description = "노드 설명", example = "OAuth2 로그인 플로우 정리")
        String description,
        @Schema(description = "노드 유형", example = "MAIN", allowableValues = {"MAIN", "SUB"})
        NodeType type,
        @Schema(description = "상위 노드 ID (루트인 경우 null)", example = "100")
        Long parentId
) {

    public CreateNodeCommand toCommand() {
        return new CreateNodeCommand(title, description, type, parentId);
    }
}
