package kr.flowmeet.api.node.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.node.dto.request.CreateAssigneeRequest;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.node.service.NodeAssigneeService;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.service.ProjectMemberService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeAssigneeFacade {

    private final NodeService nodeService;
    private final NodeAssigneeService nodeAssigneeService;
    private final ProjectMemberService projectMemberService;

    @Transactional
    public void createAssignee(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final CreateAssigneeRequest request
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(NodeErrorCode.NODE_UPDATE_FORBIDDEN);
        }

        Long assigneeUserId = request.userId();

        nodeService.validateNodeIsInProject(projectId, nodeId);
        projectMemberService.validateUserIsProjectMember(projectId, assigneeUserId);
        nodeAssigneeService.validateNotDuplicated(nodeId, assigneeUserId);

        nodeAssigneeService.create(
                NodeAssignee.builder()
                        .nodeId(nodeId)
                        .userId(assigneeUserId)
                        .build()
        );
    }

    @Transactional
    public void deleteAssignee(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final Long assigneeId
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(NodeErrorCode.NODE_UPDATE_FORBIDDEN);
        }

        NodeAssignee nodeAssignee = nodeAssigneeService.findByIdAndNodeId(assigneeId, nodeId);

        nodeAssigneeService.delete(nodeAssignee);
    }
}
