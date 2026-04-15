package kr.flowmeet.api.project.facade;

import java.util.List;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.dto.PageResponse;
import kr.flowmeet.api.file.ImageUploader;
import kr.flowmeet.api.project.dto.request.CreateProjectRequest;
import kr.flowmeet.api.project.dto.response.CreateProjectResponse;
import kr.flowmeet.api.project.dto.response.GetProjectResponse;
import kr.flowmeet.api.project.dto.response.ProjectSummaryResponse;
import kr.flowmeet.api.project.dto.request.UpdateProjectRequest;
import kr.flowmeet.domain.notification.entity.NotificationSetting;
import kr.flowmeet.domain.notification.service.NotificationSettingService;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.entity.ProjectUrl;
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
    private final ProjectMemberService projectMemberService;
    private final ProjectUrlService projectUrlService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final NotificationSettingService notificationSettingService;
    private final ImageUploader imageUploader;

    @Transactional
    public CreateProjectResponse createProject(final Long userId, final CreateProjectRequest request) {
        User user = userService.findById(userId);
        Project project = projectService.create(request.name());

        projectMemberService.create(user.getId(), project.getId(), ProjectMemberRole.OWNER);

        return CreateProjectResponse.from(project);
    }

    public PageResponse<ProjectSummaryResponse> getAllProjects(final Long userId, final String search,
                                                               final ProjectSortType sort,
                                                               final int page, final int size) {
        Page<ProjectWithMemberCountProjection> results = projectService.findAllByUserId(userId, search, sort, page, size);

        return PageResponse.from(results).map(ProjectSummaryResponse::from);
    }

    public GetProjectResponse getProject(final Long userId, final Long projectId) {
        Project project = projectService.findById(projectId);

        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(project.getId(), userId);

        int memberCount = projectMemberService.countByProjectId(project.getId());
        List<ProjectUrl> urls = projectUrlService.findAllByProjectId(project.getId());

        return GetProjectResponse.of(project, requesterMember.getRole(), memberCount, urls);
    }

    @Transactional
    public void updateProject(final Long userId, final Long projectId, final UpdateProjectRequest request) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Project project = projectService.findById(projectId);
        project.updateName(request.name());
    }

    @Transactional
    public void deleteProject(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.OWNER);

        Project project = projectService.findById(projectId);

        List<ProjectMember> members = projectMemberService.findAllByProjectId(project.getId());
        members.forEach(projectMemberService::delete);

        List<ProjectUrl> urls = projectUrlService.findAllByProjectId(project.getId());
        urls.forEach(projectUrlService::delete);

        List<NotificationSetting> settings = notificationSettingService.findAllByProjectId(project.getId());
        settings.forEach(notificationSettingService::delete);

        projectService.delete(project);
    }

    @Transactional
    public void updateProfileImage(final Long userId, final Long projectId, final MultipartFile file) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.OWNER);

        Project project = projectService.findById(projectId);
        String imageUrl = imageUploader.upload(file, "projects", FileDomainType.PROJECT_IMAGE, projectId);
        project.updateProfileImageUrl(imageUrl);
    }

}
