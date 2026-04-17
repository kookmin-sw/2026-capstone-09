package kr.flowmeet.domain.node.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.node.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findAllByProjectId(Long projectId);

    Optional<Tag> findByIdAndProjectId(Long id, Long projectId);

    boolean existsByProjectIdAndName(Long projectId, String name);

    boolean existsByIdAndProjectId(Long id, Long projectId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Tag t SET t.deletedAt = CURRENT_TIMESTAMP WHERE t.projectId = :projectId")
    int softDeleteAllByProjectId(@Param("projectId") Long projectId);
}
