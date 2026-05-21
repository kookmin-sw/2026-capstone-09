package kr.flowmeet.domain.project.service;

import java.util.List;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.repository.ProjectMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectPermissionValidator {
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectMemberService projectMemberService;

    public void validate(Long projectId, Long userId) {
        validate(projectId, userId, ProjectMemberRole.VIEWER);
    }

    public void validateNotIn(Long projectId, Long userId) {
        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new BusinessException(ProjectErrorCode.MEMBER_ALREADY_EXISTS);
        }
    }

    public void validate(Long projectId, Long userId, ProjectMemberRole minimumRole) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (minimumRole.isHigherThan(projectMember.getRole())) {
            throw new BusinessException(ProjectErrorCode.PROJECT_ACCESS_DENIED);
        }
    }

    public void validateAllAreMembers(final Long projectId, final List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return;
        }
        List<Long> distinctIds = userIds.stream().distinct().toList();
        int matched = projectMemberRepository.countByProjectIdAndUserIdIn(projectId, distinctIds);
        if (matched != distinctIds.size()) {
            throw new BusinessException(ProjectErrorCode.MEMBER_NOT_FOUND);
        }
    }
}
