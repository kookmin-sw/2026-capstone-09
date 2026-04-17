package kr.flowmeet.domain.node.service;

import java.util.List;
import kr.flowmeet.domain.node.service.vo.CreateEdgeCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.exception.EdgeErrorCode;
import kr.flowmeet.domain.node.repository.EdgeRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EdgeService {

    private final EdgeRepository edgeRepository;

    public List<Edge> findAllByProjectId(final Long projectId) {
        return edgeRepository.findAllByProjectId(projectId);
    }

    public Edge findByIdAndProjectId(final Long edgeId, final Long projectId) {
        return edgeRepository.findByIdAndProjectId(edgeId, projectId)
                .orElseThrow(() -> new BusinessException(EdgeErrorCode.EDGE_NOT_FOUND));
    }

    @Transactional
    public Edge create(final Long projectId, final Long createdById, final CreateEdgeCommand command) {
        Long startNodeId = command.startNodeId();
        Long endNodeId = command.endNodeId();

        validateNotDuplicated(startNodeId, endNodeId);

        return edgeRepository.save(
                Edge.builder()
                        .projectId(projectId)
                        .startNodeId(startNodeId)
                        .endNodeId(endNodeId)
                        .createdById(createdById)
                        .comment(command.comment())
                        .build()
        );
    }

    @Transactional
    public void delete(final Edge edge) {
        edgeRepository.delete(edge);
    }

    @Transactional
    public void deleteAllByNodeIds(final List<Long> nodeIds) {
        List<Edge> edges = edgeRepository.findAllByStartNodeIdInOrEndNodeIdIn(nodeIds, nodeIds);
        edgeRepository.deleteAll(edges);
    }

    private void validateNotDuplicated(final Long startNodeId, final Long endNodeId) {
        if (edgeRepository.existsByStartNodeIdAndEndNodeId(startNodeId, endNodeId)) {
            throw new BusinessException(EdgeErrorCode.EDGE_DUPLICATE);
        }
    }
}
