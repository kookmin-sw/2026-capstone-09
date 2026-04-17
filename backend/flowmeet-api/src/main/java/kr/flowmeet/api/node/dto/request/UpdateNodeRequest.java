package kr.flowmeet.api.node.dto.request;

import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.service.vo.UpdateNodeCommand;

public record UpdateNodeRequest(
        String title,
        String description,
        String noteContent,
        NodeStatus status,
        Integer sortOrder
) {

    public UpdateNodeCommand toCommand() {
        return new UpdateNodeCommand(title, description, noteContent, status, sortOrder);
    }
}