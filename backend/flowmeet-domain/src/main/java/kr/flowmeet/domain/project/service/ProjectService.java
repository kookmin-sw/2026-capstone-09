package kr.flowmeet.domain.project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.exception.BusinessException;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.repository.ProjectRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project findById(final Long projectId) {
        return projectRepository.findByIdAndDeletedAtIsNull(projectId)
                .orElseThrow(() -> new BusinessException(ProjectErrorCode.PROJECT_NOT_FOUND));
    }

    public Page<Object[]> findAllByUserId(final Long userId, final String search, final Pageable pageable) {
        return projectRepository.findAllByUserId(userId, search, pageable);
    }

    @Transactional
    public Project save(final Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public void delete(final Project project) {
        project.softDelete();
    }
}