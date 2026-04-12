package kr.flowmeet.domain.node.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.node.entity.Edge;

public interface EdgeRepository extends JpaRepository<Edge, Long> {

    List<Edge> findAllByProjectId(Long projectId);

    List<Edge> findAllByStartNodeIdInOrEndNodeIdIn(List<Long> startNodeIds, List<Long> endNodeIds);
}
