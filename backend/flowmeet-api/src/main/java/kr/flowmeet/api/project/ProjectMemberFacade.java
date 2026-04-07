package kr.flowmeet.api.project;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.project.dto.GetAllProjectMembersResponse;
import kr.flowmeet.api.project.dto.InviteProjectMemberRequest;
import kr.flowmeet.api.project.dto.UpdateProjectMemberRoleRequest;
import kr.flowmeet.domain.exception.BusinessException;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectMemberFacade {

    private final UserService userService;
    private final ProjectMemberService projectMemberService;

    public GetAllProjectMembersResponse getAllMembers(final Long userId, final Long projectId) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        List<ProjectMember> members = projectMemberService.findAllByProjectIdOrderByRole(requesterMember.getProjectId());

        return GetAllProjectMembersResponse.from(members);
    }

    @Transactional
    public void inviteMember(final Long userId, final Long projectId, final InviteProjectMemberRequest request) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        validateProjectMemberIsViewer(requesterMember);

        User invitee = userService.findByPrimaryEmail(request.email());

        validateProjectMemberAlreadyExists(projectId, invitee.getId());

        projectMemberService.save(
                ProjectMember.builder()
                        .projectId(projectId)
                        .userId(invitee.getId())
                        .role(ProjectMemberRole.MEMBER)
                        .build()
        );
    }

    @Transactional
    public void updateMemberRole(final Long userId, final Long projectId, final Long memberId,
                                 final UpdateProjectMemberRoleRequest request) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        validateRequesterCanChangeRole(requesterMember);

        ProjectMember targetMember = projectMemberService.findByIdAndProjectId(memberId, projectId);
        validateTargetIsNotOwnerForRoleChange(targetMember);
        validateNewRoleIsNotOwner(request.role());

        targetMember.updateRole(request.role());
    }

    @Transactional
    public void deleteMember(final Long userId, final Long projectId, final Long memberId) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        validateRequesterCanDeleteMember(requesterMember);

        ProjectMember targetMember = projectMemberService.findByIdAndProjectId(memberId, projectId);
        validateTargetIsNotOwnerForDelete(targetMember);

        projectMemberService.delete(targetMember);
    }

    @Transactional
    public void leaveProject(final Long userId, final Long projectId) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        validateRequesterIsNotOwner(requesterMember);

        projectMemberService.delete(requesterMember);
    }

    private void validateProjectMemberIsViewer(final ProjectMember member) {
        if (member.getRole() == ProjectMemberRole.VIEWER) {
            throw new BusinessException(ProjectErrorCode.MEMBER_INVITE_FORBIDDEN);
        }
    }

    private void validateProjectMemberAlreadyExists(final Long projectId, final Long userId) {
        if (projectMemberService.existsByProjectIdAndUserId(projectId, userId)) {
            throw new BusinessException(ProjectErrorCode.MEMBER_ALREADY_EXISTS);
        }
    }

    private void validateRequesterCanChangeRole(final ProjectMember requester) {
        if (!requester.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_ROLE_CHANGE_FORBIDDEN);
        }
    }

    private void validateTargetIsNotOwnerForRoleChange(final ProjectMember target) {
        if (target.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_CANNOT_CHANGE_OWNER);
        }
    }

    private void validateNewRoleIsNotOwner(final ProjectMemberRole role) {
        if (role == ProjectMemberRole.OWNER) {
            throw new BusinessException(ProjectErrorCode.MEMBER_CANNOT_CHANGE_OWNER);
        }
    }

    private void validateRequesterCanDeleteMember(final ProjectMember requester) {
        if (!requester.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_DELETE_FORBIDDEN);
        }
    }

    private void validateTargetIsNotOwnerForDelete(final ProjectMember target) {
        if (target.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_CANNOT_DELETE_OWNER);
        }
    }

    private void validateRequesterIsNotOwner(final ProjectMember requester) {
        if (requester.isOwner()) {
            throw new BusinessException(ProjectErrorCode.PROJECT_OWNER_CANNOT_LEAVE);
        }
    }
}
