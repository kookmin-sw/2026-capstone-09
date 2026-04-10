package kr.flowmeet.domain.node.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.node.repository.NodeRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeService {

    private final NodeRepository nodeRepository;

    public Node findByIdAndProjectId(final Long nodeId, final Long projectId) {
        return nodeRepository.findByIdAndProjectId(nodeId, projectId)
                .orElseThrow(() -> new BusinessException(NodeErrorCode.NODE_NOT_FOUND));
    }

    public List<Node> findAllByProjectId(final Long projectId) {
        return nodeRepository.findAllByProjectId(projectId);
    }

    public List<Node> findAllByParentId(final Long parentId) {
        return nodeRepository.findAllByParentId(parentId);
    }

    public List<Node> findAllByIds(final List<Long> nodeIds) {
        return nodeRepository.findAllById(nodeIds);
    }

    public List<Node> searchByQuery(final Long projectId, final String query) {
        return nodeRepository.searchByQuery(projectId, query);
    }

    public int countRootNodes(final Long projectId) {
        return nodeRepository.countByProjectIdAndParentIdIsNull(projectId);
    }

    public int countChildNodes(final Long parentId) {
        return nodeRepository.countByParentId(parentId);
    }

    public Map<Long, List<Long>> getChildNodeIdMap(final List<Node> nodes) {
        return nodes.stream()
                .filter(n -> n.getParentId() != null)
                .collect(Collectors.groupingBy(Node::getParentId,
                        Collectors.mapping(Node::getId, Collectors.toList())));
    }

    @Transactional
    public Node create(final Node node) {
        return nodeRepository.save(node);
    }

    @Transactional
    public void delete(final Node node) {
        nodeRepository.delete(node);
    }

    @Transactional
    public void deleteAll(final List<Node> nodes) {
        nodeRepository.deleteAll(nodes);
    }
}
