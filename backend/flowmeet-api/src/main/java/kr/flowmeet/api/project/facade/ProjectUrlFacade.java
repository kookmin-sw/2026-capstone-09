package kr.flowmeet.api.project.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.project.dto.request.ProjectUrlRequest;
import kr.flowmeet.api.project.dto.response.ProjectUrlResponse;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.entity.ProjectUrl;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectUrlService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectUrlFacade {

    private final ProjectMemberService projectMemberService;
    private final ProjectUrlService projectUrlService;

    @Transactional
    public ProjectUrlResponse addUrl(final Long userId, final Long projectId, final ProjectUrlRequest request) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        validateMemberCanEdit(requesterMember);

        ProjectUrl projectUrl = projectUrlService.create(
                ProjectUrl.builder()
                        .projectId(projectId)
                        .url(request.url())
                        .build()
        );

        return ProjectUrlResponse.from(projectUrl);
    }

    @Transactional
    public ProjectUrlResponse updateUrl(final Long userId, final Long projectId, final Long urlId,
                                        final ProjectUrlRequest request) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        validateMemberCanEdit(requesterMember);

        ProjectUrl projectUrl = projectUrlService.findByIdAndProjectId(urlId, projectId);
        projectUrl.updateUrl(request.url());

        return ProjectUrlResponse.from(projectUrl);
    }

    @Transactional
    public void deleteUrl(final Long userId, final Long projectId, final Long urlId) {
        ProjectMember requesterMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        validateMemberCanEdit(requesterMember);

        ProjectUrl projectUrl = projectUrlService.findByIdAndProjectId(urlId, projectId);
        projectUrlService.delete(projectUrl);
    }

    private void validateMemberCanEdit(final ProjectMember member) {
        if (member.getRole() == ProjectMemberRole.VIEWER) {
            throw new ApiException(ProjectErrorCode.PROJECT_ACCESS_DENIED);
        }
    }
}
