package kr.flowmeet.domain.node.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import kr.flowmeet.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.repository.NodeAssigneeRepository;

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

    public List<User> findAllUsersByNodeId(final Long nodeId) {
        return findAllByNodeId(nodeId)
                .stream()
                .map(NodeAssignee::getUser)
                .toList();
    }

    public Map<Long, List<NodeAssignee>> findAllByNodeIdsAsMap(final List<Long> nodeIds) {
        return findAllByNodeIds(nodeIds)
                .stream()
                .collect(Collectors.groupingBy(NodeAssignee::getNodeId));
    }
}
