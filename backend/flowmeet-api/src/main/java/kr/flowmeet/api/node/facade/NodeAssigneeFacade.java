package kr.flowmeet.api.node.facade;

import kr.flowmeet.domain.node.service.NodeValidator;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.node.dto.request.CreateAssigneeRequest;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.service.NodeAssigneeService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeAssigneeFacade {

    private final NodeAssigneeService nodeAssigneeService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final NodeValidator nodeValidator;

    @Transactional
    public void createAssignee(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final CreateAssigneeRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Long assigneeUserId = request.userId();

        nodeValidator.validateIsIn(nodeId, projectId);
        projectPermissionValidator.validate(projectId, assigneeUserId);

        nodeAssigneeService.create(nodeId, assigneeUserId);
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
