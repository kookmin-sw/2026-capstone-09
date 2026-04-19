package kr.flowmeet.domain.node.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.node.entity.Edge;

public interface EdgeRepository extends JpaRepository<Edge, Long> {

    List<Edge> findAllByProjectId(Long projectId);

    List<Edge> findAllByStartNodeIdInOrEndNodeIdIn(List<Long> startNodeIds, List<Long> endNodeIds);

    Optional<Edge> findByIdAndProjectId(Long id, Long projectId);

    boolean existsByStartNodeIdAndEndNodeId(Long startNodeId, Long endNodeId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Edge e SET e.deletedAt = CURRENT_TIMESTAMP WHERE e.projectId = :projectId")
    int softDeleteAllByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT e FROM Edge e JOIN FETCH e.createdBy WHERE e.projectId = :projectId")
    List<Edge> findAllWithCreatedBy(@Param("projectId") Long projectId);
}
