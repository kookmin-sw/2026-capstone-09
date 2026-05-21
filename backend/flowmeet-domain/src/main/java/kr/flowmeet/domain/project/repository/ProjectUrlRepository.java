package kr.flowmeet.domain.project.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.project.entity.ProjectUrl;

public interface ProjectUrlRepository extends JpaRepository<ProjectUrl, Long> {

    List<ProjectUrl> findAllByProjectId(Long projectId);

    Optional<ProjectUrl> findByIdAndProjectId(Long id, Long projectId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ProjectUrl pu SET pu.deletedAt = CURRENT_TIMESTAMP WHERE pu.projectId = :projectId")
    int softDeleteAllByProjectId(@Param("projectId") Long projectId);
}
