package kr.flowmeet.api.node.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.node.dto.request.CreateAssigneeRequest;
import kr.flowmeet.api.node.facade.NodeAssigneeFacade;
import kr.flowmeet.api.node.success.NodeAssigneeSuccessCode;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/projects/{projectId}/nodes/{nodeId}/assignees")
@RequiredArgsConstructor
public class NodeAssigneeController implements NodeAssigneeApi {

    private final NodeAssigneeFacade nodeAssigneeFacade;

    @Override
    @PostMapping
    public CommonResponse<?> createAssignee(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody CreateAssigneeRequest request
    ) {
        nodeAssigneeFacade.createAssignee(userId, projectId, nodeId, request);
        return CommonResponse.ok(NodeAssigneeSuccessCode.CREATE_ASSIGNEE);
    }

    @Override
    @DeleteMapping("/{assigneeId}")
    public CommonResponse<?> deleteAssignee(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @PathVariable Long assigneeId
    ) {
        nodeAssigneeFacade.deleteAssignee(userId, projectId, nodeId, assigneeId);
        return CommonResponse.ok(NodeAssigneeSuccessCode.DELETE_ASSIGNEE);
    }
}
