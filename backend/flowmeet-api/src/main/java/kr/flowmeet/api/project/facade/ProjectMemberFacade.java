package kr.flowmeet.api.project.facade;

import java.util.List;
import kr.flowmeet.api.project.dto.request.UpdateProjectMemberRoleRequest;
import kr.flowmeet.api.project.dto.response.GetAllProjectMembersResponse;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectMemberFacade {

    private final ProjectMemberService projectMemberService;
    private final ProjectPermissionValidator projectPermissionValidator;

    public GetAllProjectMembersResponse getAllMembers(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<ProjectMember> members = projectMemberService.findAllByProjectIdOrderByRole(projectId);

        return GetAllProjectMembersResponse.of(members);
    }

    @Transactional
    public void updateMemberRole(final Long userId, final Long projectId, final Long memberId,
                                 final UpdateProjectMemberRoleRequest request) {
        if (request.role() == ProjectMemberRole.OWNER) {
            projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.OWNER);
        } else {
            projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);
        }

        projectMemberService.updateRole(projectId, userId, memberId, request.role());
    }

    @Transactional
    public void deleteMember(final Long userId, final Long projectId, final Long memberId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.OWNER);
        projectMemberService.deleteByProjectIdAndMemberId(projectId, memberId);
    }

    @Transactional
    public void leaveProject(final Long userId, final Long projectId) {
        projectMemberService.leave(projectId, userId);
    }

}
