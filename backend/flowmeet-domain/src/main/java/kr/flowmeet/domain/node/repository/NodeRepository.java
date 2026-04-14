package kr.flowmeet.domain.node.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.node.entity.Node;

public interface NodeRepository extends JpaRepository<Node, Long> {

    List<Node> findAllByProjectId(Long projectId);

    Optional<Node> findByIdAndProjectId(Long id, Long projectId);

    List<Node> findAllByParentId(Long parentId);

    @Query("SELECT n FROM Node n WHERE n.projectId = :projectId " +
            "AND (n.title LIKE CONCAT('%', :query, '%') OR n.description LIKE CONCAT('%', :query, '%'))")
    List<Node> searchByQuery(@Param("projectId") Long projectId, @Param("query") String query);

    int countByProjectIdAndParentIdIsNull(Long projectId);

    int countByParentId(Long parentId);

    boolean existsByIdAndProjectId(Long id, Long projectId);
}
