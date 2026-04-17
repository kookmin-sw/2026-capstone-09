package kr.flowmeet.api.node.dto.request;

import jakarta.validation.constraints.NotBlank;
import kr.flowmeet.domain.node.entity.NodeType;
import kr.flowmeet.domain.node.service.vo.CreateNodeCommand;

public record CreateNodeRequest(
        @NotBlank(message = "노드 제목은 필수로 입력해 주세요.")
        String title,
        String description,
        NodeType type,
        Long parentId
) {

    public CreateNodeCommand toCommand() {
        return new CreateNodeCommand(title, description, type, parentId);
    }
}
