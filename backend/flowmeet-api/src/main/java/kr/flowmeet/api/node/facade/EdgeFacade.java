package kr.flowmeet.api.node.facade;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.node.dto.request.CreateEdgeRequest;
import kr.flowmeet.api.node.dto.response.GetEdgesResponse;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.service.EdgeService;
import kr.flowmeet.domain.node.service.NodeValidator;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EdgeFacade {

    private final EdgeService edgeService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final NodeValidator nodeValidator;

    public GetEdgesResponse getEdges(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);
        List<Edge> edges = edgeService.findAllByProjectId(projectId);
        return GetEdgesResponse.of(edges);
    }

    @Transactional
    public void createEdge(
            final Long userId,
            final Long projectId,
            final CreateEdgeRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Long startNodeId = request.startNodeId();
        Long endNodeId = request.endNodeId();

        nodeValidator.validateIsIn(startNodeId, projectId);
        nodeValidator.validateIsIn(endNodeId, projectId);

        edgeService.create(projectId, userId, request.toCommand());
    }

    @Transactional
    public void deleteEdge(final Long userId, final Long projectId, final Long edgeId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Edge edge = edgeService.findByIdAndProjectId(edgeId, projectId);

        edgeService.delete(edge);
    }
}
