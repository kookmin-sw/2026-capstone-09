package kr.flowmeet.domain.node.service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.entity.NodeType;
import kr.flowmeet.domain.node.service.vo.CreateNodeCommand;
import kr.flowmeet.domain.node.service.vo.UpdateNodeKanbanCommand;
import kr.flowmeet.domain.node.service.vo.UpdateNodeStatusCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.node.repository.EdgeRepository;
import kr.flowmeet.domain.node.repository.NodeAssigneeRepository;
import kr.flowmeet.domain.node.repository.NodeRepository;
import kr.flowmeet.domain.node.repository.NodeTagRepository;
import kr.flowmeet.domain.node.repository.TagRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeService {

    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final TagRepository tagRepository;
    private final NodeAssigneeRepository nodeAssigneeRepository;
    private final NodeTagRepository nodeTagRepository;

    private static final int SORT_ORDER_GAP = 1024;

    public Node findById(final Long nodeId) {
        return nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessException(NodeErrorCode.NODE_NOT_FOUND));
    }

    public List<Node> findAllByParentId(final Long parentId) {
        return nodeRepository.findAllByParentId(parentId);
    }

    public Node findByIdAndProjectId(final Long nodeId, final Long projectId) {
        return nodeRepository.findByIdAndProjectId(nodeId, projectId)
                .orElseThrow(() -> new BusinessException(NodeErrorCode.NODE_NOT_FOUND));
    }

    public List<Node> findAllByProjectId(final Long projectId) {
        return nodeRepository.findAllByProjectId(projectId);
    }

    public List<Node> findAllByProjectId(final Long projectId, final NodeSortType sort) {
        return nodeRepository.findAllByProjectId(projectId, sort);
    }

    public List<Node> findAllByIdsAndProjectId(final List<Long> nodeIds, final Long projectId) {
        List<Node> nodes = nodeRepository.findAllByIdInAndProjectId(nodeIds, projectId);
        if (nodes.size() != nodeIds.size()) {
            throw new BusinessException(NodeErrorCode.NODE_NOT_FOUND);
        }
        return nodes;
    }

    public List<Long> findAllIdsByProjectId(final Long projectId) {
        return findAllByProjectId(projectId).stream()
                .map(Node::getId)
                .toList();
    }

    public List<Node> searchByQuery(final Long projectId, final String query) {
        return nodeRepository.searchByQuery(projectId, query);
    }

    public Map<Long, List<Long>> getChildNodeIdMap(final List<Node> nodes) {
        return nodes.stream()
                .filter(n -> n.getParentId() != null)
                .collect(Collectors.groupingBy(Node::getParentId,
                        Collectors.mapping(Node::getId, Collectors.toList())));
    }

    @Transactional
    public String issueChildNumber(final Long parentId, final Long projectId) {
        Node parent = nodeRepository.findByIdAndProjectIdWithLock(parentId, projectId)
                .orElseThrow(() -> new BusinessException(NodeErrorCode.NODE_NOT_FOUND));
        return parent.getNumber() + "." + parent.issueChildSeq();
    }

    @Transactional
    public void createFirstMainNode(final Long projectId) {
        CreateNodeCommand command = new CreateNodeCommand("새 메인 노드", null, NodeType.MAIN, null);
        create(projectId, "1", command);
    }

    @Transactional
    public void create(final Long projectId, final String number, final CreateNodeCommand command) {

        Long parentId = command.parentId();
        int sortOrder = nextSortOrder(projectId, parentId, NodeStatus.WAITING);

        Node node = Node.builder()
                .projectId(projectId)
                .parentId(parentId)
                .number(number)
                .title(command.title())
                .description(command.description())
                .status(NodeStatus.WAITING)
                .type(command.type())
                .sortOrder(sortOrder)
                .build();

        nodeRepository.save(node);
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

    @Transactional
    public void deleteAllByProjectId(final Long projectId) {
        List<Long> nodeIds = findAllIdsByProjectId(projectId);

        if (!nodeIds.isEmpty()) {
            nodeAssigneeRepository.deleteAllByNodeIdIn(nodeIds);
            nodeTagRepository.deleteAllByNodeIdIn(nodeIds);
        }
        edgeRepository.deleteAllByProjectId(projectId);
        tagRepository.softDeleteAllByProjectId(projectId);
        nodeRepository.softDeleteAllByProjectId(projectId);
    }

    @Transactional
    public void updateNodeTitle(final Long projectId, final Long nodeId, final String title) {
        Node node = findByIdAndProjectId(nodeId, projectId);

        node.updateTitle(title);
    }

    @Transactional
    public void updateNodeDescription(final Long projectId, final Long nodeId, final String description) {
        Node node = findByIdAndProjectId(nodeId, projectId);

        node.updateDescription(description);
    }

    @Transactional
    public void updateNodeNote(final Long projectId, final Long nodeId, final String noteContent) {
        Node node = findByIdAndProjectId(nodeId, projectId);

        node.updateNoteContent(noteContent);
    }

    @Transactional
    public void updateNodeKanban(final Long projectId, final Long nodeId, final UpdateNodeKanbanCommand command) {
        Node node = findByIdAndProjectId(nodeId, projectId);

        node.updateKanban(command.status(), command.sortOrder());
    }

    @Transactional
    public void updateNodeStatus(final Long projectId, final Long nodeId, final UpdateNodeStatusCommand command) {
        Node node = findByIdAndProjectId(nodeId, projectId);

        node.updateStatus(command.status());
    }

    @Transactional
    public void saveSummary(final Long nodeId, final String summary) {
        Node node = findById(nodeId);
        node.saveSummary(summary);
    }

    private int nextSortOrder(final Long projectId, final Long parentId, final NodeStatus status) {
        int maxOrder = parentId != null
                ? nodeRepository.findMaxSortOrderByParentId(parentId, status)
                : nodeRepository.findMaxSortOrderByProjectIdAndRootNodes(projectId, status);
        return maxOrder + SORT_ORDER_GAP;
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
