package kr.flowmeet.api.node.facade;

import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
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
    private final ProjectPermissionValidator projectPermissionValidator;

    @Transactional
    public void createAssignee(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final CreateAssigneeRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Long assigneeUserId = request.userId();

        nodeService.validateNodeIsInProject(projectId, nodeId);
        projectPermissionValidator.validate(projectId, userId);
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
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        NodeAssignee nodeAssignee = nodeAssigneeService.findByIdAndNodeId(assigneeId, nodeId);

        nodeAssigneeService.delete(nodeAssignee);
    }
}
