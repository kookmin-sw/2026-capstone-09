package kr.flowmeet.api.project;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.project.dto.CreateProjectRequest;
import kr.flowmeet.api.project.dto.CreateProjectResponse;
import kr.flowmeet.api.project.dto.GetAllProjectsResponse;
import kr.flowmeet.api.project.dto.GetProjectResponse;
import kr.flowmeet.api.project.dto.UpdateProjectRequest;
import kr.flowmeet.domain.exception.BusinessException;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.entity.ProjectUrl;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectService;
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

    @Transactional
    public CreateProjectResponse createProject(final Long userId, final CreateProjectRequest request) {
        User user = userService.findById(userId);

        Project project = projectService.create(
                Project.builder()
                        .name(request.name())
                        .build()
        );

        projectMemberService.create(
                ProjectMember.builder()
                        .projectId(project.getId())
                        .userId(user.getId())
                        .role(ProjectMemberRole.OWNER)
                        .build()
        );

        return CreateProjectResponse.from(project);
    }

    public GetAllProjectsResponse getAllProjects(final Long userId, final String search, final Pageable pageable) {
        Page<ProjectWithMemberCountProjection> results = projectService.findAllByUserId(userId, search, pageable);

        List<GetAllProjectsResponse.ProjectItem> projects = results.getContent().stream()
                .map(projection -> GetAllProjectsResponse.ProjectItem.of(
                        projection.project(), projection.memberCount().intValue()))
                .toList();

        return GetAllProjectsResponse.of(projects, results.getTotalElements(), results.getTotalPages(),
                results.getNumber(), results.getSize());
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
        validateMemberCanEdit(projectId, userId);

        Project project = projectService.findById(projectId);
        project.updateName(request.name());
    }

    @Transactional
    public void deleteProject(final Long userId, final Long projectId) {
        validateMemberCanDeleteProject(projectId, userId);

        Project project = projectService.findById(projectId);
        projectService.delete(project);

        List<ProjectMember> members = projectMemberService.findAllByProjectId(project.getId());
        members.forEach(projectMemberService::delete);

        List<ProjectUrl> urls = projectUrlService.findAllByProjectId(project.getId());
        urls.forEach(projectUrlService::delete);
    }

    private void validateMemberCanEdit(final Long projectId, final Long userId) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (requesterMember.getRole() == ProjectMemberRole.VIEWER) {
            throw new BusinessException(ProjectErrorCode.PROJECT_ACCESS_DENIED);
        }
    }

    private void validateMemberCanDeleteProject(final Long projectId, final Long userId) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!requesterMember.isOwner()) {
            throw new BusinessException(ProjectErrorCode.PROJECT_DELETE_FORBIDDEN);
        }
    }
}
