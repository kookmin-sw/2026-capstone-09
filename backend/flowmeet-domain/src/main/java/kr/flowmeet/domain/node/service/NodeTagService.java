package kr.flowmeet.domain.node.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import kr.flowmeet.domain.node.entity.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.repository.NodeTagRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeTagService {

    private final NodeTagRepository nodeTagRepository;

    public List<NodeTag> findAllByNodeId(final Long nodeId) {
        return nodeTagRepository.findAllWithTagByNodeId(nodeId);
    }

    public List<Tag> findAllTagsByNodeId(final Long nodeId) {
        return findAllByNodeId(nodeId)
                .stream()
                .map(NodeTag::getTag)
                .toList();
    }

    public List<NodeTag> findAllByNodeIds(final List<Long> nodeIds) {
        return nodeTagRepository.findAllWithTagByNodeIds(nodeIds);
    }

    public Map<Long, List<NodeTag>> findAllByNodeIdsAsMap(final List<Long> nodeIds) {
        return findAllByNodeIds(nodeIds)
                .stream()
                .collect(Collectors.groupingBy(NodeTag::getNodeId));
    }
}
