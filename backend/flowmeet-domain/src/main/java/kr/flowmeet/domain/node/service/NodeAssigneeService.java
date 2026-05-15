package kr.flowmeet.domain.node.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.exception.AssigneeErrorCode;
import kr.flowmeet.domain.node.repository.NodeAssigneeRepository;
import kr.flowmeet.domain.user.entity.User;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeAssigneeService {

    private final NodeAssigneeRepository nodeAssigneeRepository;

    public List<NodeAssignee> findAllByNodeId(final Long nodeId) {
        return nodeAssigneeRepository.findAllWithUserByNodeId(nodeId);
    }

    public List<NodeAssignee> findAllByNodeIds(final List<Long> nodeIds) {
        return nodeAssigneeRepository.findAllWithUserByNodeIdIn(nodeIds);
    }

    public Map<Long, List<NodeAssignee>> findAllByNodeIdsAsMap(final List<Long> nodeIds) {
        return findAllByNodeIds(nodeIds)
                .stream()
                .collect(Collectors.groupingBy(NodeAssignee::getNodeId));
    }

    public NodeAssignee findByIdAndNodeId(final Long assigneeId, final Long nodeId) {
        return nodeAssigneeRepository.findByIdAndNodeId(assigneeId, nodeId)
                .orElseThrow(() -> new BusinessException(AssigneeErrorCode.ASSIGNEE_NOT_FOUND));
    }

    @Transactional
    public NodeAssignee create(final Long nodeId, final Long userId) {
        validateNotDuplicated(nodeId, userId);

        return nodeAssigneeRepository.save(
                NodeAssignee.builder()
                        .nodeId(nodeId)
                        .userId(userId)
                        .build()
        );
    }

    @Transactional
    public void delete(final NodeAssignee nodeAssignee) {
        nodeAssigneeRepository.delete(nodeAssignee);
    }

    private void validateNotDuplicated(final Long nodeId, final Long userId) {
        if (nodeAssigneeRepository.existsByNodeIdAndUserId(nodeId, userId)) {
            throw new BusinessException(AssigneeErrorCode.ASSIGNEE_ALREADY_EXISTS);
        }
    }
}
