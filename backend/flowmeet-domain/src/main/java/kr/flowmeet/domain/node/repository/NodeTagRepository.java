package kr.flowmeet.domain.node.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.node.entity.NodeTag;

public interface NodeTagRepository extends JpaRepository<NodeTag, Long> {

    @Query("SELECT nt FROM NodeTag nt JOIN FETCH nt.tag WHERE nt.nodeId = :nodeId")
    List<NodeTag> findAllWithTagByNodeId(@Param("nodeId") Long nodeId);

    @Query("SELECT nt FROM NodeTag nt JOIN FETCH nt.tag WHERE nt.nodeId IN :nodeIds")
    List<NodeTag> findAllWithTagByNodeIds(@Param("nodeIds") List<Long> nodeIds);

    boolean existsByNodeIdAndTagId(Long nodeId, Long tagId);

    Optional<NodeTag> findByNodeIdAndTagId(Long nodeId, Long tagId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM NodeTag nt WHERE nt.tagId = :tagId")
    int deleteAllByTagId(@Param("tagId") Long tagId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM NodeTag nt WHERE nt.nodeId IN :nodeIds")
    int deleteAllByNodeIdIn(@Param("nodeIds") List<Long> nodeIds);
}
