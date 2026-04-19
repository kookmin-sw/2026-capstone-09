package kr.flowmeet.api.project.facade;

import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.project.dto.request.ProjectUrlRequest;
import kr.flowmeet.api.project.dto.response.ProjectUrlResponse;
import kr.flowmeet.domain.project.entity.ProjectUrl;
import kr.flowmeet.domain.project.service.ProjectUrlService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectUrlFacade {

    private final ProjectUrlService projectUrlService;
    private final ProjectPermissionValidator projectPermissionValidator;

    @Transactional
    public ProjectUrlResponse addUrl(final Long userId, final Long projectId, final ProjectUrlRequest request) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        ProjectUrl projectUrl = projectUrlService.create(projectId, request.url());

        return ProjectUrlResponse.from(projectUrl);
    }

    @Transactional
    public ProjectUrlResponse updateUrl(final Long userId, final Long projectId, final Long urlId,
                                        final ProjectUrlRequest request) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        ProjectUrl projectUrl = projectUrlService.updateUrl(projectId, urlId, request.url());

        return ProjectUrlResponse.from(projectUrl);
    }

    @Transactional
    public void deleteUrl(final Long userId, final Long projectId, final Long urlId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        projectUrlService.deleteByProjectIdAndUrlId(projectId, urlId);
    }

}
