package kr.flowmeet.domain.node.repository;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.node.entity.Node;

public interface NodeRepository extends JpaRepository<Node, Long>, NodeRepositoryCustom {

    List<Node> findAllByProjectId(Long projectId);

    List<Node> findAllByIdInAndProjectId(List<Long> ids, Long projectId);

    Optional<Node> findByIdAndProjectId(Long id, Long projectId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT n FROM Node n WHERE n.id = :id AND n.projectId = :projectId")
    Optional<Node> findByIdAndProjectIdWithLock(@Param("id") Long id, @Param("projectId") Long projectId);

    List<Node> findAllByParentId(Long parentId);

    int countByProjectIdAndParentIdIsNull(Long projectId);

    int countByParentId(Long parentId);

    boolean existsByIdAndProjectId(Long id, Long projectId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Node n SET n.deletedAt = CURRENT_TIMESTAMP WHERE n.projectId = :projectId")
    int softDeleteAllByProjectId(@Param("projectId") Long projectId);
}
