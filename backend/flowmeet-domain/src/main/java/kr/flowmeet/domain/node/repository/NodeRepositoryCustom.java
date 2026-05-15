package kr.flowmeet.domain.node.repository;

import java.util.List;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.service.NodeSortType;

public interface NodeRepositoryCustom {

    List<Node> findAllByProjectId(Long projectId, NodeSortType sort);

    List<Node> searchByQuery(Long projectId, String query);
}
