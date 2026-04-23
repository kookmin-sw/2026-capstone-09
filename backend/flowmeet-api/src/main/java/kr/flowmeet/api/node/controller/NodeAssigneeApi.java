package kr.flowmeet.api.node.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.node.dto.request.CreateAssigneeRequest;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.node.exception.AssigneeErrorCode;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;

@Tag(name = "NodeAssignee", description = "노드 담당자")
public interface NodeAssigneeApi {

    @Operation(summary = "담당자 추가", description = "노드에 담당자를 추가합니다.")
    @ApiErrorCode(code = NodeErrorCode.class, names = {"NODE_NOT_FOUND", "NODE_CREATE_FORBIDDEN"})
    @ApiErrorCode(code = AssigneeErrorCode.class, names = {"ASSIGNEE_ALREADY_EXISTS"})
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_NOT_FOUND"})
    CommonResponse<?> createAssignee(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody CreateAssigneeRequest request
    );

    @Operation(summary = "담당자 제거", description = "노드에서 담당자를 제거합니다.")
    @ApiErrorCode(code = AssigneeErrorCode.class, names = {"ASSIGNEE_NOT_FOUND"})
    CommonResponse<?> deleteAssignee(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @PathVariable Long assigneeId
    );
}
