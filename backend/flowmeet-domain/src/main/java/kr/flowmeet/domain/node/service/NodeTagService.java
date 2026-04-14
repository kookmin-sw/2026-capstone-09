package kr.flowmeet.domain.node.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.node.exception.TagErrorCode;
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

    public void validateNotDuplicated(final Long nodeId, final Long tagId) {
        if (nodeTagRepository.existsByNodeIdAndTagId(nodeId, tagId)) {
            throw new BusinessException(TagErrorCode.NODE_TAG_ALREADY_EXISTS);
        }
    }

    @Transactional
    public NodeTag create(final NodeTag nodeTag) {
        return nodeTagRepository.save(nodeTag);
    }

    @Transactional
    public void deleteByNodeIdAndTagId(final Long nodeId, final Long tagId) {
        NodeTag nodeTag = nodeTagRepository.findByNodeIdAndTagId(nodeId, tagId)
                .orElseThrow(() -> new BusinessException(TagErrorCode.TAG_NOT_FOUND));
        nodeTagRepository.delete(nodeTag);
    }

    @Transactional
    public void deleteAllByTagId(final Long tagId) {
        nodeTagRepository.deleteAllByTagId(tagId);
    }
}
