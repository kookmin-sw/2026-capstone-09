package kr.flowmeet.domain.project.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.project.entity.Project;
import kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT new kr.flowmeet.domain.project.repository.projection.ProjectWithMemberCountProjection(p, COUNT(pm2)) " +
            "FROM Project p " +
            "JOIN ProjectMember pm ON pm.projectId = p.id " +
            "JOIN ProjectMember pm2 ON pm2.projectId = p.id " +
            "WHERE pm.userId = :userId " +
            "AND (:search IS NULL OR p.name LIKE CONCAT('%', :search, '%')) " +
            "GROUP BY p")
    Page<ProjectWithMemberCountProjection> findAllByUserId(@Param("userId") Long userId,
                                                           @Param("search") String search,
                                                           Pageable pageable);
}
