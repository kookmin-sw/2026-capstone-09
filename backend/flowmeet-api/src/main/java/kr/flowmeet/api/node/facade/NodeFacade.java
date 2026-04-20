package kr.flowmeet.api.node.facade;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import kr.flowmeet.domain.common.BaseTimeEntity;
import kr.flowmeet.domain.node.service.NodeValidator;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.node.dto.request.CreateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeStatusRequest;
import kr.flowmeet.api.node.dto.response.GetFlowchartResponse;
import kr.flowmeet.api.node.dto.response.GetKanbanResponse;
import kr.flowmeet.api.node.dto.response.GetNodeListResponse;
import kr.flowmeet.api.node.dto.response.GetNodeResponse;
import kr.flowmeet.api.node.dto.response.SearchNodeResponse;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.service.MeetingService;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.node.service.EdgeService;
import kr.flowmeet.domain.node.service.NodeAssigneeService;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.node.service.NodeTagService;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeFacade {

    private final NodeService nodeService;
    private final EdgeService edgeService;
    private final NodeTagService nodeTagService;
    private final NodeAssigneeService nodeAssigneeService;
    private final MeetingService meetingService;
    private final ProjectService projectService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final NodeValidator nodeValidator;

    public GetFlowchartResponse getFlowchart(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId);
        List<Edge> edges = edgeService.findAllByProjectId(projectId);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);

        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);
        Map<Long, List<NodeAssignee>> assigneeMap = nodeAssigneeService.findAllByNodeIdsAsMap(nodeIds);
        Set<Long> meetingNodeIds = meetingService.findAllMeetingNodeIds(nodeIds);
        Map<Long, List<Long>> childIdMap = nodeService.getChildNodeIdMap(nodes);

        return GetFlowchartResponse.of(nodes, edges, nodeTagMap, assigneeMap, meetingNodeIds, childIdMap);
    }

    public GetNodeResponse getNode(final Long userId, final Long projectId, final Long nodeId) {
        projectPermissionValidator.validate(projectId, userId);

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);
        List<Tag> tags = nodeTagService.findAllTagsByNodeId(nodeId);

        List<User> assignees = nodeAssigneeService.findAllUsersByNodeId(nodeId);
        Meeting meeting = meetingService.findByNodeId(nodeId)
                .orElse(null);

        return GetNodeResponse.of(node, tags, assignees, meeting);
    }

    @Transactional
    public void createNode(final Long userId, final Long projectId, final CreateNodeRequest request) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        String number;

        if (request.parentId() != null) {
            nodeValidator.validateIsIn(request.parentId(), projectId);
            number = nodeService.issueChildNumber(request.parentId(), projectId);
        } else {
            number = String.valueOf(projectService.issueRootNodeSeq(projectId));
        }

        nodeService.create(projectId, number, request.toCommand());
    }

    @Transactional
    public void updateNode(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final UpdateNodeRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        nodeService.updateNode(projectId, nodeId, request.toCommand());
    }

    @Transactional
    public void deleteNode(final Long userId, final Long projectId, final Long nodeId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);

        nodeValidator.validateNoActiveMeeting(node);

        List<Long> descendantIds = nodeService.findAllDescendantIds(node);
        List<Long> allNodeIds = new ArrayList<>(descendantIds);
        allNodeIds.add(nodeId);

        edgeService.deleteAllByNodeIds(allNodeIds);
        nodeService.deleteWithAllDescendants(node);
    }

    public GetNodeListResponse getNodeList(
            final Long userId,
            final Long projectId,
            final String sort
    ) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);
        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);
        Map<Long, List<NodeAssignee>> assigneeMap = nodeAssigneeService.findAllByNodeIdsAsMap(nodeIds);
        Set<Long> meetingNodeIds = meetingService.findAllMeetingNodeIds(nodeIds);

        //TODO: 정렬 QueryDSL로 처리하기

        return GetNodeListResponse.of(nodes, nodeTagMap, assigneeMap, meetingNodeIds);
    }

    public GetKanbanResponse getKanban(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);

        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);
        Map<Long, List<NodeAssignee>> assigneeMap = nodeAssigneeService.findAllByNodeIdsAsMap(nodeIds);

        Map<NodeStatus, List<Node>> statusMap = nodes.stream()
                .collect(Collectors.groupingBy(Node::getStatus));

        return GetKanbanResponse.of(statusMap, nodeTagMap, assigneeMap);
    }

    @Transactional
    public void updateNodeStatus(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final UpdateNodeStatusRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        nodeService.updateNodeStatus(projectId, nodeId, request.toCommand());
    }

    public SearchNodeResponse search(final Long userId, final Long projectId, final String query) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.searchByQuery(projectId, query);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);
        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);

        return SearchNodeResponse.of(nodes, nodeTagMap);
    }

    private List<Long> getNodeIdFromNodes(List<Node> nodes) {
        return nodes.stream()
                .map(Node::getId)
                .toList();
    }
}
