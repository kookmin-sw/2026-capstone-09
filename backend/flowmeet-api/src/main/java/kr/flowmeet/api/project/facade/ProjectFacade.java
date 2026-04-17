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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectFacade {

    private final ProjectService projectService;
    private final ProjectEraser projectEraser;
    private final ProjectMemberService projectMemberService;
    private final ProjectUrlService projectUrlService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final ImageUploader imageUploader;

    @Transactional
    public CreateProjectResponse createProject(final Long userId, final CreateProjectRequest request) {
        Project project = projectService.create(request.name());

        projectMemberService.create(userId, project.getId(), ProjectMemberRole.OWNER);

        return CreateProjectResponse.from(project);
    }

    public PageResponse<ProjectSummaryResponse> getAllProjects(final Long userId, final String search,
                                                               final ProjectSortType sort,
                                                               final int page, final int size) {
        Page<ProjectWithMemberCountProjection> results = projectService.findAllByUserId(userId, search, sort, page, size);

        return PageResponse.from(results).map(ProjectSummaryResponse::from);
    }

    public GetProjectResponse getProject(final Long userId, final Long projectId) {
        ProjectMemberRole myRole = projectPermissionValidator.validateAndGetRole(projectId, userId);

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

}
