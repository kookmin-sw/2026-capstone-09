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

    boolean existsByIdAndProjectId(Long id, Long projectId);

    @Query(value = "SELECT * FROM tags WHERE project_id = :projectId AND name = :name LIMIT 1 FOR UPDATE", nativeQuery = true)
    Optional<Tag> findByProjectIdAndNameIncludingDeleted(@Param("projectId") Long projectId, @Param("name") String name);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM tags WHERE tag_id = :tagId", nativeQuery = true)
    void hardDeleteById(@Param("tagId") Long tagId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Tag t SET t.deletedAt = CURRENT_TIMESTAMP WHERE t.projectId = :projectId")
    int softDeleteAllByProjectId(@Param("projectId") Long projectId);
}
