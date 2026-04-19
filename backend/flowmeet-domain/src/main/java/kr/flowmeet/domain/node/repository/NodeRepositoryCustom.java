package kr.flowmeet.domain.node.repository;

import java.util.List;
import kr.flowmeet.domain.node.entity.Node;

public interface NodeRepositoryCustom {

    List<Node> searchByQuery(Long projectId, String query);
}
