package kr.flowmeet.domain.project.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findAllByProjectId(Long projectId);

    @Query("SELECT pm FROM ProjectMember pm " +
            "JOIN FETCH pm.user u " +
            "WHERE pm.projectId = :projectId " +
            "ORDER BY CASE pm.role WHEN 'OWNER' THEN 0 WHEN 'MEMBER' THEN 1 WHEN 'VIEWER' THEN 2 END, u.nickname ASC")
    List<ProjectMember> findAllByProjectIdOrderByRole(@Param("projectId") Long projectId);

    Optional<ProjectMember> findByIdAndProjectId(Long id, Long projectId);

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    List<ProjectMember> findAllByUserId(Long userId);

    boolean existsByUserIdAndRole(Long userId, ProjectMemberRole role);

    int countByProjectId(Long projectId);
}
