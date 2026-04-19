package kr.flowmeet.api.project.facade;

import java.util.List;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.api.common.properties.FrontendProperties;
import kr.flowmeet.api.file.facade.ImageUploader;
import kr.flowmeet.api.project.dto.request.AcceptProjectInvitationRequest;
import kr.flowmeet.api.project.dto.request.CreateProjectRequest;
import kr.flowmeet.api.project.dto.request.InviteProjectMemberRequest;
import kr.flowmeet.api.project.dto.request.UpdateProjectRequest;
import kr.flowmeet.api.project.dto.response.AcceptProjectInvitationResponse;
import kr.flowmeet.api.project.dto.response.CreateProjectResponse;
import kr.flowmeet.api.project.dto.response.GetProjectResponse;
import kr.flowmeet.api.project.dto.response.ProjectSummaryResponse;
import kr.flowmeet.auth.jwt.InvitationTokenPayload;
import kr.flowmeet.auth.jwt.JwtProvider;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.common.vo.CursorSlice;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.entity.ProjectUrl;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectService;
import kr.flowmeet.domain.project.service.ProjectSortType;
import kr.flowmeet.domain.project.service.ProjectUrlService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectFacade {

    private final UserService userService;
    private final ProjectService projectService;
    private final ProjectEraser projectEraser;
    private final ProjectMemberService projectMemberService;
    private final ProjectUrlService projectUrlService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final ImageUploader imageUploader;
    private final JwtProvider jwtProvider;
    private final FrontendProperties frontendProperties;

    @Transactional
    public CreateProjectResponse createProject(final Long userId, final CreateProjectRequest request) {
        Project project = projectService.create(request.name());

        projectMemberService.create(userId, project.getId(), ProjectMemberRole.OWNER);

        return CreateProjectResponse.from(project);
    }

    public CursorSliceResponse<ProjectSummaryResponse> getAllProjects(
            final Long userId,
            final String search,
            final ProjectSortType sort,
            final Long cursorId,
            final String cursorValue,
            final int size
    ) {
        List<ProjectWithMemberCountProjection> projects =
                projectService.findAllByUserId(userId, search, sort, CursorSlice.of(cursorId, cursorValue, size));

        return CursorSliceResponse.of(
                projects,
                size,
                ProjectSummaryResponse::from,
                item -> item.project().getId(),
                item -> sort.extractValue(item.project())
        );
    }

    public GetProjectResponse getProject(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);
        ProjectMemberRole myRole = projectMemberService.findMemberRole(projectId, userId);

        Project project = projectService.findById(projectId);
        int memberCount = projectMemberService.countByProjectId(projectId);
        List<ProjectUrl> urls = projectUrlService.findAllByProjectId(projectId);

        return GetProjectResponse.of(project, myRole, memberCount, urls);
    }

    @Transactional
    public void updateProject(final Long userId, final Long projectId, final UpdateProjectRequest request) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        projectService.updateName(projectId, request.name());
    }

    @Transactional
    public void deleteProject(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.OWNER);

        Project project = projectService.findById(projectId);
        projectEraser.erase(project);
    }

    @Transactional
    public void updateProfileImage(final Long userId, final Long projectId, final MultipartFile file) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.OWNER);

        String imageUrl = imageUploader.upload(file, "projects", FileDomainType.PROJECT_IMAGE, projectId);
        projectService.updateProfileImageUrl(projectId, imageUrl);
    }

    @Transactional
    public void inviteMember(final Long userId, final Long projectId, final InviteProjectMemberRequest request) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        User inviter = userService.findById(userId);
        String email = request.email();

        userService.findOptionalByEmail(email)
                .ifPresent((u) -> projectPermissionValidator.validateNotIn(projectId, u.getId()));

        String token = jwtProvider.generateInvitationToken(projectId, email);
        String inviteLink = frontendProperties.buildInvitationUrl(token);

        projectService.invite(email, projectId, inviter, inviteLink);
    }

    @Transactional
    public AcceptProjectInvitationResponse acceptInvitation(final Long userId, final AcceptProjectInvitationRequest request) {
        InvitationTokenPayload payload = jwtProvider.parseInvitationToken(request.token());
        User user = userService.findById(userId);
        Long projectId = payload.projectId();

        projectPermissionValidator.validateNotIn(projectId, userId);

        projectMemberService.acceptInvitation(user, projectId, payload.inviteeEmail());

        return AcceptProjectInvitationResponse.of(projectId);
    }

}
