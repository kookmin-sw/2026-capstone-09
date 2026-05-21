package kr.flowmeet.api.node.facade;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import kr.flowmeet.api.ai.handler.NodeSummaryTextMerger;
import kr.flowmeet.api.node.dto.response.AnalyzeDraggedNodesResponse;
import kr.flowmeet.api.node.dto.response.RequestNodeSummaryResponse;
import kr.flowmeet.api.node.event.NodeSummaryRequestEvent;
import kr.flowmeet.domain.node.event.NodeCreatedEvent;
import kr.flowmeet.domain.node.event.NodeDeletedEvent;
import kr.flowmeet.domain.node.event.NodeUpdatedEvent;
import kr.flowmeet.domain.ai.entity.AiTask;
import kr.flowmeet.domain.ai.entity.AiTaskType;
import kr.flowmeet.domain.ai.service.AiTaskService;
import kr.flowmeet.domain.node.service.NodeSortType;
import kr.flowmeet.domain.node.service.NodeValidator;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.node.dto.request.CreateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeKanbanRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeStatusRequest;
import kr.flowmeet.api.node.dto.response.GetFlowchartResponse;
import kr.flowmeet.api.node.dto.response.GetKanbanResponse;
import kr.flowmeet.api.node.dto.response.GetLinkedNodesResponse;
import kr.flowmeet.api.node.dto.response.GetNodeListResponse;
import kr.flowmeet.api.node.dto.response.GetNodeResponse;
import kr.flowmeet.api.node.dto.response.SearchNodeResponse;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.entity.MeetingParticipant;
import kr.flowmeet.domain.meeting.service.MeetingService;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
import kr.flowmeet.domain.node.entity.NodeStatus;
import kr.flowmeet.domain.node.entity.NodeTag;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.external.ai.NodeAnalysisClient;
import kr.flowmeet.external.ai.dto.NodeAnalysisResult;
import kr.flowmeet.domain.node.service.EdgeService;
import kr.flowmeet.domain.node.service.NodeAssigneeService;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.node.service.NodeTagService;
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
    private final UserService userService;
    private final AiTaskService aiTaskService;
    private final ApplicationEventPublisher eventPublisher;
    private final NodeAnalysisClient nodeAnalysisClient;

    public GetFlowchartResponse getFlowchart(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId);
        List<Edge> edges = edgeService.findAllByProjectId(projectId);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);

        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);
        Map<Long, List<NodeAssignee>> assigneeMap = nodeAssigneeService.findAllByNodeIdsAsMap(nodeIds);
        Set<Long> meetingNodeIds = meetingService.findAllMeetingNodeIds(nodeIds);
        Map<Long, List<Long>> childIdMap = nodeService.getChildNodeIdMap(nodes);

        List<Node> sortedNodes = nodes.stream()
                .sorted(NODE_NUMBER_ORDER)
                .toList();

        return GetFlowchartResponse.of(sortedNodes, edges, nodeTagMap, assigneeMap, meetingNodeIds, childIdMap);
    }

    public GetNodeResponse getNode(final Long userId, final Long projectId, final Long nodeId) {
        projectPermissionValidator.validate(projectId, userId);

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);
        List<Tag> tags = nodeTagService.findAllTagsByNodeId(nodeId);

        List<NodeAssignee> assignees = nodeAssigneeService.findAllByNodeId(nodeId);
        Meeting meeting = meetingService.findByNodeId(nodeId)
            .orElse(null);

        List<MeetingParticipant> participants = List.of();
        Map<Long, User> meetingUserMap = Map.of();

        if (meeting != null) {
            participants = meetingService.findAllParticipantsByMeetingId(meeting.getId());
            List<Long> userIds = new ArrayList<>(participants.stream().map(MeetingParticipant::getUserId).toList());

            userIds.add(meeting.getCreatedById());

            meetingUserMap = userService.findAllByIdsAsMap(userIds);
        }

        return GetNodeResponse.of(node, tags, assignees, meeting, participants, meetingUserMap);
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
        eventPublisher.publishEvent(NodeCreatedEvent.of(projectId));
    }

    @Transactional
    public void updateNodeTitle(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final String title
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        nodeService.updateNodeTitle(projectId, nodeId, title);
        eventPublisher.publishEvent(NodeUpdatedEvent.of(projectId));
    }

    @Transactional
    public void updateNodeDescription(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final String description
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        nodeService.updateNodeDescription(projectId, nodeId, description);
        eventPublisher.publishEvent(NodeUpdatedEvent.of(projectId));
    }

    @Transactional
    public void updateNodeNote(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final String noteContent
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        nodeService.updateNodeNote(projectId, nodeId, noteContent);
        eventPublisher.publishEvent(NodeUpdatedEvent.of(projectId));
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
        eventPublisher.publishEvent(NodeDeletedEvent.of(projectId));
    }

    public GetNodeListResponse getNodeList(
        final Long userId,
        final Long projectId,
        final NodeSortType sort
    ) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.findAllByProjectId(projectId, sort);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);
        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);
        Map<Long, List<NodeAssignee>> assigneeMap = nodeAssigneeService.findAllByNodeIdsAsMap(nodeIds);
        Set<Long> meetingNodeIds = meetingService.findAllMeetingNodeIds(nodeIds);

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
    public void updateNodeKanban(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final UpdateNodeKanbanRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        nodeService.updateNodeKanban(projectId, nodeId, request.toCommand());
        eventPublisher.publishEvent(NodeUpdatedEvent.of(projectId));
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
        eventPublisher.publishEvent(NodeUpdatedEvent.of(projectId));
    }

    public GetLinkedNodesResponse getLinkedNodes(
            final Long userId,
            final Long projectId,
            final Long nodeId
    ) {
        projectPermissionValidator.validate(projectId, userId);
        nodeValidator.validateIsIn(nodeId, projectId);

        List<Edge> edges = edgeService.findAllLinkedByNodeId(projectId, nodeId);

        return GetLinkedNodesResponse.of(nodeId, edges);
    }

    // TODO: 추후 노트(noteContent) 포함 여부 검토
    @Transactional
    public RequestNodeSummaryResponse requestNodeSummary(
            final Long userId,
            final Long projectId,
            final Long nodeId
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        nodeValidator.validateIsIn(nodeId, projectId);
        List<Node> childNodes = nodeService.findAllByParentId(nodeId);

        List<Long> childNodeIds = childNodes.stream().map(Node::getId).toList();
        List<Meeting> meetings = meetingService.findAllByNodeIds(childNodeIds);

        Map<Long, Meeting> meetingByNodeId = meetings.stream()
                .collect(Collectors.toMap(Meeting::getNodeId, m -> m, (a, b) -> a));

        String mergedText = NodeSummaryTextMerger.merge(childNodes, meetingByNodeId);
        if (mergedText.isEmpty()) {
            throw new BusinessException(NodeErrorCode.NO_CHILD_SUMMARY);
        }

        AiTask aiTask = aiTaskService.create(userId, projectId, nodeId, AiTaskType.MAIN_SUMMARY);
        eventPublisher.publishEvent(new NodeSummaryRequestEvent(aiTask.getId(), mergedText));

        return RequestNodeSummaryResponse.from(aiTask.getId());
    }

    // TODO: 추후 노트(noteContent) 포함 여부 검토
    public AnalyzeDraggedNodesResponse analyzeDraggedNodes(
            final Long userId,
            final Long projectId,
            final List<Long> nodeIds
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        List<Node> nodes = nodeService.findAllByIdsAndProjectId(nodeIds, projectId);
        List<Meeting> meetings = meetingService.findAllByNodeIds(nodeIds);

        String analysisText = buildAnalysisText(nodes, meetings);

        NodeAnalysisResult result = nodeAnalysisClient.analyze(analysisText);
        return AnalyzeDraggedNodesResponse.from(result);
    }

    private String buildAnalysisText(final List<Node> nodes, final List<Meeting> meetings) {
        Map<Long, Meeting> meetingByNodeId = meetings.stream()
                .filter(m -> m.getSummary() != null)
                .collect(Collectors.toMap(Meeting::getNodeId, m -> m, (a, b) -> a));

        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (Node node : nodes) {
            Meeting meeting = meetingByNodeId.get(node.getId());
            if (meeting == null) {
                continue;
            }
            sb.append("name: ").append(node.getTitle()).append("\n")
                    .append("\"").append(meeting.getSummary()).append("\"\n\n");
            count++;
        }

        if (count < 2) {
            throw new BusinessException(NodeErrorCode.NOT_ENOUGH_SUMMARIES_FOR_ANALYSIS);
        }
        return sb.toString().trim();
    }

    public SearchNodeResponse search(final Long userId, final Long projectId, final String query) {
        projectPermissionValidator.validate(projectId, userId);

        List<Node> nodes = nodeService.searchByQuery(projectId, query);

        List<Long> nodeIds = getNodeIdFromNodes(nodes);
        Map<Long, List<NodeTag>> nodeTagMap = nodeTagService.findAllByNodeIdsAsMap(nodeIds);

        return SearchNodeResponse.of(nodes, nodeTagMap);
    }

    private static final Comparator<Node> NODE_NUMBER_ORDER = (a, b) -> {
        String[] partsA = a.getNumber().split("\\.");
        String[] partsB = b.getNumber().split("\\.");
        for (int i = 0; i < Math.min(partsA.length, partsB.length); i++) {
            int cmp = Integer.compare(Integer.parseInt(partsA[i]), Integer.parseInt(partsB[i]));
            if (cmp != 0) return cmp;
        }
        return Integer.compare(partsA.length, partsB.length);
    };

    private List<Long> getNodeIdFromNodes(List<Node> nodes) {
        return nodes.stream()
            .map(Node::getId)
            .toList();
    }
}
