package kr.flowmeet.domain.project.service;

import java.util.List;
import kr.flowmeet.domain.project.event.ProjectMemberJoinedEvent;
import kr.flowmeet.domain.user.entity.User;
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

    public ProjectMemberRole findMemberRole(final Long projectId, final Long userId) {
        return findByProjectIdAndUserId(projectId, userId).getRole();
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
    public void updateRole(final Long projectId, final Long requesterId, final Long memberId, final ProjectMemberRole newRole) {
        ProjectMember target = findByIdAndProjectId(memberId, projectId);
        if (target.isOwner() && newRole != ProjectMemberRole.OWNER) {
            ProjectMember requester = findByProjectIdAndUserId(projectId, requesterId);
            if (!requester.getId().equals(target.getId())) {
                throw new BusinessException(ProjectErrorCode.MEMBER_CANNOT_CHANGE_OWNER);
            }
        }
        target.updateRole(newRole);
    }

    @Transactional
    public void deleteByProjectIdAndMemberId(final Long projectId, final Long memberId) {
        ProjectMember target = findByIdAndProjectId(memberId, projectId);
        if (target.isOwner()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_CANNOT_DELETE_OWNER);
        }
        projectMemberRepository.delete(target);
    }

    @Transactional
    public void leave(final Long projectId, final Long userId) {
        ProjectMember member = findByProjectIdAndUserId(projectId, userId);
        if (member.isOwner()) {
            validateSoleOwnerCannotLeave(projectId);
        }
        projectMemberRepository.delete(member);
    }

    private void validateSoleOwnerCannotLeave(final Long projectId) {
        int totalMembers = projectMemberRepository.countByProjectId(projectId);
        if (totalMembers > 1) {
            int ownerCount = projectMemberRepository.countByProjectIdAndRole(projectId, ProjectMemberRole.OWNER);
            if (ownerCount == 1) {
                throw new BusinessException(ProjectErrorCode.PROJECT_OWNER_CANNOT_LEAVE);
            }
        }
    }

    @Transactional
    public void delete(final ProjectMember projectMember) {
        projectMemberRepository.delete(projectMember);
    }

    @Transactional
    public void deleteAllByProjectId(final Long projectId) {
        projectMemberRepository.softDeleteAllByProjectId(projectId);
    }

    @Transactional
    public void acceptInvitation(final User user, final Long projectId, final String inviteeEmail) {
        if (!user.getEmail().equals(inviteeEmail)) {
            throw new BusinessException(ProjectErrorCode.INVITATION_EMAIL_MISMATCH);
        }

        create(user.getId(), projectId, ProjectMemberRole.VIEWER);
    }
}
