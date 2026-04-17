package kr.flowmeet.api.project.facade;

import java.util.List;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.converters.PropertyCustomizingConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.ApplicationEventPublisher;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.project.dto.response.GetAllProjectMembersResponse;
import kr.flowmeet.api.project.dto.request.InviteProjectMemberRequest;
import kr.flowmeet.api.project.dto.request.UpdateProjectMemberRoleRequest;
import kr.flowmeet.domain.notification.entity.Notification;
import kr.flowmeet.domain.notification.entity.NotificationType;
import kr.flowmeet.domain.notification.service.NotificationService;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.event.ProjectMemberJoinedEvent;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectMemberFacade {

    private final UserService userService;
    private final ProjectService projectService;
    private final ProjectMemberService projectMemberService;
    private final ProjectPermissionValidator projectPermissionValidator;

    public GetAllProjectMembersResponse getAllMembers(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<ProjectMember> members = projectMemberService.findAllByProjectIdOrderByRole(projectId);

        return GetAllProjectMembersResponse.of(members);
    }

    @Transactional
    public void inviteMember(final Long userId, final Long projectId, final InviteProjectMemberRequest request) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        User inviter = userService.findById(userId);
        String email = request.email();

        userService.findOptionalByEmail(email)
                .ifPresent((u) -> projectPermissionValidator.validateNotIn(projectId, u.getId()));

        //TODO: 초대만 하고 등록은 API 따로 만들기 + 초대 관리 테이블 따로 만들어야 함
        projectService.invite(email, projectId, inviter);
    }

    @Transactional
    public void updateMemberRole(final Long userId, final Long projectId, final Long memberId,
                                 final UpdateProjectMemberRoleRequest request) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        ProjectMember targetMember = projectMemberService.findByIdAndProjectId(memberId, projectId);

        if (targetMember.isOwner()) {
            throw new ApiException(ProjectErrorCode.MEMBER_CANNOT_CHANGE_OWNER);
        }

        if (request.role() == ProjectMemberRole.OWNER) {
            throw new ApiException(ProjectErrorCode.MEMBER_CANNOT_CHANGE_OWNER);
        }

        targetMember.updateRole(request.role());
    }

    @Transactional
    public void deleteMember(final Long userId, final Long projectId, final Long memberId) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!requesterMember.isOwner()) {
            throw new ApiException(ProjectErrorCode.MEMBER_DELETE_FORBIDDEN);
        }

        ProjectMember targetMember = projectMemberService.findByIdAndProjectId(memberId, projectId);

        if (targetMember.isOwner()) {
            throw new ApiException(ProjectErrorCode.MEMBER_CANNOT_DELETE_OWNER);
        }

        projectMemberService.delete(targetMember);
    }

    @Transactional
    public void leaveProject(final Long userId, final Long projectId) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        if (requesterMember.isOwner()) {
            throw new ApiException(ProjectErrorCode.PROJECT_OWNER_CANNOT_LEAVE);
        }

        projectMemberService.delete(requesterMember);
    }

}
