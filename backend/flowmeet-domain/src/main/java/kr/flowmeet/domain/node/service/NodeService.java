package kr.flowmeet.domain.node.service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
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

    public List<Long> findAllDescendantIds(Node node) {
        return findAllDescendants(node.getProjectId(), node.getId()).stream()
                .map(Node::getId)
                .toList();
    }

    @Transactional
    public void deleteWithAllDescendants(Node node) {
        List<Node> descendants = findAllDescendants(node.getProjectId(), node.getId());

        nodeRepository.deleteAll(descendants);
        nodeRepository.delete(node);
    }

    public void validateNodeIsInProject(Long projectId, Long nodeId) {
        if (!nodeRepository.existsByIdAndProjectId(nodeId, projectId)) {
            throw new BusinessException(NodeErrorCode.NODE_NOT_FOUND);
        }
    }

    private List<Node> findAllDescendants(Long projectId, Long nodeId) {
        List<Node> allNodes = findAllByProjectId(projectId);

        Map<Long, List<Node>> childMap = allNodes.stream()
                .filter(n -> n.getParentId() != null)
                .collect(Collectors.groupingBy(Node::getParentId));

        List<Node> descendants = new ArrayList<>();
        Deque<Long> queue = new ArrayDeque<>();

        queue.add(nodeId);

        while (!queue.isEmpty()) {
            Long currentId = queue.poll();
            List<Node> children = childMap.getOrDefault(currentId, List.of());

            descendants.addAll(children);
            children.forEach(child -> queue.add(child.getId()));
        }

        return descendants;
    }
}
