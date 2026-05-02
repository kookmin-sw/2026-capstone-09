package kr.flowmeet.domain.project.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long>, ProjectMemberRepositoryCustom {

    List<ProjectMember> findAllByProjectId(Long projectId);

    Optional<ProjectMember> findByIdAndProjectId(Long id, Long projectId);

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    int countByProjectIdAndUserIdIn(Long projectId, List<Long> userIds);

    List<ProjectMember> findAllByUserId(Long userId);

    boolean existsByUserIdAndRole(Long userId, ProjectMemberRole role);

    int countByProjectId(Long projectId);

    int countByProjectIdAndRole(Long projectId, ProjectMemberRole role);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ProjectMember pm SET pm.deletedAt = CURRENT_TIMESTAMP WHERE pm.projectId = :projectId")
    int softDeleteAllByProjectId(@Param("projectId") Long projectId);
}