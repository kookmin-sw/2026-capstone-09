package kr.flowmeet.api.node.facade;

import kr.flowmeet.domain.node.exception.EdgeErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.node.dto.request.CreateEdgeRequest;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.service.EdgeService;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.service.ProjectMemberService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EdgeFacade {

    private final EdgeService edgeService;
    private final NodeService nodeService;
    private final ProjectMemberService projectMemberService;

    @Transactional
    public void createEdge(
            final Long userId,
            final Long projectId,
            final CreateEdgeRequest request
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(EdgeErrorCode.EDGE_CREATE_FORBIDDEN);
        }

        Long startNodeId = request.startNodeId();
        Long endNodeId = request.endNodeId();

        nodeService.findByIdAndProjectId(startNodeId, projectId);
        nodeService.findByIdAndProjectId(endNodeId, projectId);
        edgeService.validateNotDuplicated(startNodeId, endNodeId);

        Edge edge = Edge.builder()
                .projectId(projectId)
                .startNodeId(startNodeId)
                .endNodeId(endNodeId)
                .createdById(userId)
                .comment(request.comment())
                .build();

        edgeService.create(edge);
    }

    @Transactional
    public void deleteEdge(final Long userId, final Long projectId, final Long edgeId) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(EdgeErrorCode.EDGE_DELETE_FORBIDDEN);
        }

        Edge edge = edgeService.findByIdAndProjectId(edgeId, projectId);
        edgeService.delete(edge);
    }
}
