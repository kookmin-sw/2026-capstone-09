package kr.flowmeet.domain.project.service;

import java.util.List;
import kr.flowmeet.domain.project.event.ProjectMemberJoinedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.repository.ProjectMemberRepository;
import kr.flowmeet.domain.user.exception.UserErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    public ProjectMember findByProjectIdAndUserId(final Long projectId, final Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new BusinessException(ProjectErrorCode.MEMBER_NOT_FOUND));
    }

    public ProjectMember findByIdAndProjectId(final Long memberId, final Long projectId) {
        return projectMemberRepository.findByIdAndProjectId(memberId, projectId)
                .orElseThrow(() -> new BusinessException(ProjectErrorCode.MEMBER_NOT_FOUND));
    }

    public List<ProjectMember> findAllByProjectId(final Long projectId) {
        return projectMemberRepository.findAllByProjectId(projectId);
    }

    public List<ProjectMember> findAllByProjectIdOrderByRole(final Long projectId) {
        return projectMemberRepository.findAllByProjectIdOrderByRole(projectId);
    }

    public List<ProjectMember> findAllByUserId(final Long userId) {
        return projectMemberRepository.findAllByUserId(userId);
    }

    public void validateUserIsNotProjectOwner(final Long userId) {
        if (projectMemberRepository.existsByUserIdAndRole(userId, ProjectMemberRole.OWNER)) {
            throw new BusinessException(UserErrorCode.USER_IS_PROJECT_OWNER);
        }
    }

    public int countByProjectId(final Long projectId) {
        return projectMemberRepository.countByProjectId(projectId);
    }

    @Transactional
    public void create(final Long userId, final Long projectId, final ProjectMemberRole role) {
        ProjectMember projectMember = ProjectMember.builder()
                .userId(userId)
                .projectId(projectId)
                .role(role)
                .build();

        projectMemberRepository.save(projectMember);
        applicationEventPublisher.publishEvent(ProjectMemberJoinedEvent.of(userId, projectId));
    }

    @Transactional
    public void delete(final ProjectMember projectMember) {
        projectMemberRepository.delete(projectMember);
    }

    @Transactional
    public void deleteAllByProjectId(final Long projectId) {
        projectMemberRepository.softDeleteAllByProjectId(projectId);
    }
}
