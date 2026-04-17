package kr.flowmeet.domain.node.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NodeAssigneeRepository extends JpaRepository<NodeAssignee, Long> {

    @Query("SELECT na FROM NodeAssignee na JOIN FETCH na.user WHERE na.nodeId = :nodeId")
    List<NodeAssignee> findAllWithUserByNodeId(@Param("nodeId") Long nodeId);

    @Query("SELECT na FROM NodeAssignee na JOIN FETCH na.user WHERE na.nodeId IN :nodeIds")
    List<NodeAssignee> findAllWithUserByNodeIdIn(@Param("nodeIds") List<Long> nodeIds);

    boolean existsByNodeIdAndUserId(Long nodeId, Long userId);

    Optional<NodeAssignee> findByIdAndNodeId(Long id, Long nodeId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE NodeAssignee na SET na.deletedAt = CURRENT_TIMESTAMP WHERE na.nodeId IN :nodeIds")
    int softDeleteAllByNodeIdIn(@Param("nodeIds") List<Long> nodeIds);
}
