package kr.flowmeet.domain.node.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NodeAssigneeRepository extends JpaRepository<NodeAssignee, Long> {

    @Query("SELECT na FROM NodeAssignee na JOIN FETCH na.user WHERE na.nodeId = :nodeId")
    List<NodeAssignee> findAllWithUserByNodeId(@Param("nodeId") Long nodeId);

    @Query("SELECT na FROM NodeAssignee na JOIN FETCH na.user WHERE na.nodeId IN :nodeIds")
    List<NodeAssignee> findAllWithUserByNodeIdIn(@Param("nodeIds") List<Long> nodeIds);
}
