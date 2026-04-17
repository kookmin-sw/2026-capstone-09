package kr.flowmeet.domain.project.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.project.entity.ProjectUrl;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.repository.ProjectUrlRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectUrlService {

    private final ProjectUrlRepository projectUrlRepository;

    public List<ProjectUrl> findAllByProjectId(final Long projectId) {
        return projectUrlRepository.findAllByProjectId(projectId);
    }

    public ProjectUrl findByIdAndProjectId(final Long urlId, final Long projectId) {
        return projectUrlRepository.findByIdAndProjectId(urlId, projectId)
                .orElseThrow(() -> new BusinessException(ProjectErrorCode.PROJECT_URL_NOT_FOUND));
    }

    @Transactional
    public ProjectUrl create(final Long projectId, final String url) {
        return projectUrlRepository.save(
                ProjectUrl.builder()
                        .projectId(projectId)
                        .url(url)
                        .build()
        );
    }

    @Transactional
    public ProjectUrl updateUrl(final Long projectId, final Long urlId, final String url) {
        ProjectUrl projectUrl = findByIdAndProjectId(urlId, projectId);
        projectUrl.updateUrl(url);
        return projectUrl;
    }

    @Transactional
    public void deleteByProjectIdAndUrlId(final Long projectId, final Long urlId) {
        ProjectUrl projectUrl = findByIdAndProjectId(urlId, projectId);
        projectUrlRepository.delete(projectUrl);
    }

    @Transactional
    public void delete(final ProjectUrl projectUrl) {
        projectUrlRepository.delete(projectUrl);
    }

    @Transactional
    public void deleteAllByProjectId(final Long projectId) {
        projectUrlRepository.softDeleteAllByProjectId(projectId);
    }
}
