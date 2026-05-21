package kr.flowmeet.domain.project.service;

import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.project.event.ProjectMemberInvitedEvent;
import kr.flowmeet.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.common.vo.CursorSlice;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.repository.ProjectRepository;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ApplicationEventPublisher eventPublisher;
    private final ProjectRepository projectRepository;

    public Project findById(final Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new BusinessException(ProjectErrorCode.PROJECT_NOT_FOUND));
    }

    public List<ProjectWithMemberCountProjection> findAllByUserId(
            final Long userId,
            final String search,
            final ProjectSortType sort,
            final CursorSlice cursorSlice
    ) {
        return projectRepository.findAllByUserId(userId, search, sort, cursorSlice);
    }

    @Transactional
    public Project create(final String name) {
        return projectRepository.save(
                Project.builder()
                        .name(name)
                        .build()
        );
    }

    @Transactional
    public void updateName(final Long projectId, final String name) {
        Project project = findById(projectId);
        project.updateName(name);
    }

    @Transactional
    public void updateProfileImageUrl(final Long projectId, final String imageUrl) {
        Project project = findById(projectId);
        project.updateProfileImageUrl(imageUrl);
    }

    @Transactional
    public void delete(final Project project) {
        projectRepository.delete(project);
    }

    @Transactional
    public int issueRootNodeSeq(final Long projectId) {
        Project project = projectRepository.findByIdWithLock(projectId)
                .orElseThrow(() -> new BusinessException(ProjectErrorCode.PROJECT_NOT_FOUND));
      
        return project.issueRootNodeSeq();
    }

    @Transactional
    public void invite(final String email, final Long projectId, final User inviter, final String inviteLink) {
        Project project = findById(projectId);

        eventPublisher.publishEvent(
                ProjectMemberInvitedEvent.of(
                        project.getId(),
                        project.getName(),
                        email,
                        inviter.getNickname(),
                        inviteLink
                )
        );
    }

    @Transactional
    public void touchLastActivityAt(final Long projectId, final LocalDateTime now) {
        projectRepository.touchLastActivityAt(projectId, now);
    }
}
