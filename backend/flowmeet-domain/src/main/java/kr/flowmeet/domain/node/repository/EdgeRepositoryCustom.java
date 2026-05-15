package kr.flowmeet.domain.node.repository;

import java.util.List;
import kr.flowmeet.domain.node.entity.Edge;

public interface EdgeRepositoryCustom {

    List<Edge> findAllLinkedByNodeId(Long projectId, Long nodeId);
}
