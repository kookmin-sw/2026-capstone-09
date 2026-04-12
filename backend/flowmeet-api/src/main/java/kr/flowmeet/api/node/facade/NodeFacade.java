package kr.flowmeet.api.node.facade;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import kr.flowmeet.domain.common.BaseTimeEntity;
import kr.flowmeet.domain.project.entity.ProjectMember;
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
import kr.flowmeet.api.node.dto.response.UpdateNodeResponse;
import kr.flowmeet.api.node.dto.response.UpdateNodeStatusResponse;
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
    private final ProjectMemberService projectMemberService;

    public GetFlowchartResponse getFlowchart(final Long userId, final Long projectId) {
        projectMemberService.validateUserIsProjectMember(projectId, userId);

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
        projectMemberService.validateUserIsProjectMember(projectId, userId);

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);
        List<Tag> tags = nodeTagService.findAllTagsByNodeId(nodeId);

        List<User> assignees = nodeAssigneeService.findAllUsersByNodeId(nodeId);
        Meeting meeting = meetingService.findByNodeId(nodeId)
                .orElse(null);

        return GetNodeResponse.of(node, tags, assignees, meeting);
    }

    @Transactional
    public void createNode(final Long userId, final Long projectId, final CreateNodeRequest request) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(NodeErrorCode.NODE_CREATE_FORBIDDEN);
        }

        if (request.parentId() != null) {
            nodeService.findByIdAndProjectId(request.parentId(), projectId);
        }

        int sortOrder = request.parentId() != null
                ? nodeService.countChildNodes(request.parentId())
                : nodeService.countRootNodes(projectId);

        Node node = Node.builder()
                .projectId(projectId)
                .parentId(request.parentId())
                .title(request.title())
                .description(request.description())
                .type(request.type())
                .status(NodeStatus.WAITING)
                .sortOrder(sortOrder)
                .build();

        nodeService.create(node);
    }

    @Transactional
    public UpdateNodeResponse updateNode(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final UpdateNodeRequest request
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(NodeErrorCode.NODE_CREATE_FORBIDDEN);
        }

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);

        node.update(
                request.title(),
                request.description(),
                request.noteContent(),
                request.status(),
                request.sortOrder()
        );

        return UpdateNodeResponse.from(node);
    }

    @Transactional
    public void deleteNode(final Long userId, final Long projectId, final Long nodeId) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(NodeErrorCode.NODE_CREATE_FORBIDDEN);
        }

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);

        if (meetingService.hasActiveMeeting(nodeId)) {
            throw new ApiException(NodeErrorCode.NODE_HAS_ACTIVE_MEETING);
        }

        nodeService.deleteWithAllDescendants(node);
    }

    public GetNodeListResponse getNodeList(
            final Long userId,
            final Long projectId,
            final String sort,
            final List<NodeStatus> statuses,
            final List<Long> tagIds,
            final List<Long> assigneeIds,
            final Boolean hasMeeting
    ) {
        projectMemberService.validateUserIsProjectMember(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);
        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);
        Map<Long, List<NodeAssignee>> assigneeMap = nodeAssigneeService.findAllByNodeIdsAsMap(nodeIds);
        Set<Long> meetingNodeIds = meetingService.findAllMeetingNodeIds(nodeIds);

        //TODO: QueryDSL 도입해서 검색 필터 레이어 옮기기
        List<Node> filteredNodes = nodes.stream()
                .filter(n -> statuses == null || statuses.isEmpty() || statuses.contains(n.getStatus()))
                .filter(n -> tagIds == null || tagIds.isEmpty() ||
                        nodeTagMap.getOrDefault(n.getId(), List.of()).stream()
                                .anyMatch(nt -> tagIds.contains(nt.getTagId())))
                .filter(n -> assigneeIds == null || assigneeIds.isEmpty() ||
                        assigneeMap.getOrDefault(n.getId(), List.of()).stream()
                                .anyMatch(na -> assigneeIds.contains(na.getUserId())))
                .filter(n -> hasMeeting == null || meetingNodeIds.contains(n.getId()) == hasMeeting)
                .toList();

        if (sort != null) {
            filteredNodes = new ArrayList<>(filteredNodes);
            switch (sort) {
                case "CREATED_ASC" -> filteredNodes.sort(Comparator.comparing(BaseTimeEntity::getCreatedAt));
                case "CREATED_DESC" -> filteredNodes.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
                case "UPDATED_ASC" -> filteredNodes.sort(Comparator.comparing(BaseTimeEntity::getUpdatedAt));
                case "UPDATED_DESC" -> filteredNodes.sort((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()));
                default -> {}
            }
        }

        return GetNodeListResponse.of(filteredNodes, nodeTagMap, assigneeMap, meetingNodeIds);
    }

    public GetKanbanResponse getKanban(final Long userId, final Long projectId) {
        projectMemberService.validateUserIsProjectMember(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);

        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);
        Map<Long, List<NodeAssignee>> assigneeMap = nodeAssigneeService.findAllByNodeIdsAsMap(nodeIds);

        Map<NodeStatus, List<Node>> statusMap = nodes.stream()
                .collect(Collectors.groupingBy(Node::getStatus));

        return GetKanbanResponse.of(statusMap, nodeTagMap, assigneeMap);
    }

    @Transactional
    public UpdateNodeStatusResponse updateNodeStatus(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final UpdateNodeStatusRequest request
    ) {
        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        if (!projectMember.canEdit()) {
            throw new ApiException(NodeErrorCode.NODE_CREATE_FORBIDDEN);
        }

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);
        node.updateStatus(request.status(), request.sortOrder());

        return UpdateNodeStatusResponse.from(node);
    }

    public SearchNodeResponse search(final Long userId, final Long projectId, final String query) {
        projectMemberService.validateUserIsProjectMember(projectId, userId);

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
