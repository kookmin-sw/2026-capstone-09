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
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectService;
import kr.flowmeet.domain.project.service.ProjectUrlService;
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
        userService.findById(userId);

        Project project = projectService.save(
                Project.builder()
                        .name(request.name())
                        .build()
        );

        projectMemberService.save(
                ProjectMember.builder()
                        .projectId(project.getId())
                        .userId(userId)
                        .role(ProjectMemberRole.OWNER)
                        .build()
        );

        return CreateProjectResponse.from(project);
    }

    public GetAllProjectsResponse getAllProjects(final Long userId, final String search, final Pageable pageable) {
        Page<Object[]> results = projectService.findAllByUserId(userId, search, pageable);

        List<GetAllProjectsResponse.ProjectItem> projects = results.getContent().stream()
                .map(row -> {
                    Project project = (Project) row[0];
                    int memberCount = ((Long) row[1]).intValue();
                    return GetAllProjectsResponse.ProjectItem.of(project, memberCount);
                })
                .toList();

        return GetAllProjectsResponse.of(projects, results.getTotalElements(), results.getTotalPages(),
                results.getNumber(), results.getSize());
    }

    public GetProjectResponse getProject(final Long userId, final Long projectId) {
        Project project = projectService.findById(projectId);

        ProjectMember myMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        int memberCount = projectMemberService.countByProjectId(projectId);
        List<ProjectUrl> urls = projectUrlService.findAllByProjectId(projectId);

        return GetProjectResponse.of(project, myMember.getRole(), memberCount, urls);
    }

    @Transactional
    public void updateProject(final Long userId, final Long projectId, final UpdateProjectRequest request) {
        ProjectMember myMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (myMember.getRole() == ProjectMemberRole.VIEWER) {
            throw new BusinessException(ProjectErrorCode.PROJECT_ACCESS_DENIED);
        }

        Project project = projectService.findById(projectId);
        project.updateName(request.name());
    }

    @Transactional
    public void deleteProject(final Long userId, final Long projectId) {
        ProjectMember myMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!myMember.isOwner()) {
            throw new BusinessException(ProjectErrorCode.PROJECT_DELETE_FORBIDDEN);
        }

        Project project = projectService.findById(projectId);
        projectService.delete(project);

        List<ProjectMember> members = projectMemberService.findAllByProjectId(projectId);
        members.forEach(projectMemberService::delete);

        List<ProjectUrl> urls = projectUrlService.findAllByProjectId(projectId);
        urls.forEach(projectUrlService::delete);
    }
}
