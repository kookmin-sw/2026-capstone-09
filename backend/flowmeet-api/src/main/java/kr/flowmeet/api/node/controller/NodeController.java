package kr.flowmeet.api.node.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.node.dto.request.CreateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeDescriptionRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeKanbanRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeNoteRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeStatusRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeTitleRequest;
import kr.flowmeet.api.node.dto.response.GetFlowchartResponse;
import kr.flowmeet.api.node.dto.response.GetKanbanResponse;
import kr.flowmeet.api.node.dto.response.GetLinkedNodesResponse;
import kr.flowmeet.api.node.dto.response.GetNodeListResponse;
import kr.flowmeet.api.node.dto.response.GetNodeResponse;
import kr.flowmeet.api.node.dto.response.SearchNodeResponse;
import kr.flowmeet.api.node.facade.NodeFacade;
import kr.flowmeet.api.node.success.NodeSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.node.service.NodeSortType;

@RestController
@RequestMapping("/v1/projects/{projectId}")
@RequiredArgsConstructor
public class NodeController implements NodeApi {

    private final NodeFacade nodeFacade;

    @Override
    @GetMapping("/nodes")
    public CommonResponse<GetFlowchartResponse> getFlowchart(@UserId Long userId, @PathVariable Long projectId) {
        return CommonResponse.ok(NodeSuccessCode.GET_FLOWCHART, nodeFacade.getFlowchart(userId, projectId));
    }

    @Override
    @GetMapping("/nodes/{nodeId}")
    public CommonResponse<GetNodeResponse> getNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId
    ) {
        return CommonResponse.ok(NodeSuccessCode.GET_NODE, nodeFacade.getNode(userId, projectId, nodeId));
    }

    @Override
    @PostMapping("/nodes")
    public CommonResponse<?> createNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateNodeRequest request
    ) {
        nodeFacade.createNode(userId, projectId, request);
        return CommonResponse.ok(NodeSuccessCode.CREATE_NODE);
    }

    @Override
    @PatchMapping("/nodes/{nodeId}/title")
    public CommonResponse<?> updateNodeTitle(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeTitleRequest request
    ) {
        nodeFacade.updateNodeTitle(userId, projectId, nodeId, request.title());
        return CommonResponse.ok(NodeSuccessCode.UPDATE_NODE_TITLE);
    }

    @Override
    @PatchMapping("/nodes/{nodeId}/description")
    public CommonResponse<?> updateNodeDescription(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeDescriptionRequest request
    ) {
        nodeFacade.updateNodeDescription(userId, projectId, nodeId, request.description());
        return CommonResponse.ok(NodeSuccessCode.UPDATE_NODE_DESCRIPTION);
    }

    @Override
    @PatchMapping("/nodes/{nodeId}/note")
    public CommonResponse<?> updateNodeNote(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeNoteRequest request
    ) {
        nodeFacade.updateNodeNote(userId, projectId, nodeId, request.noteContent());
        return CommonResponse.ok(NodeSuccessCode.UPDATE_NODE_NOTE);
    }

    @Override
    @DeleteMapping("/nodes/{nodeId}")
    public CommonResponse<?> deleteNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId
    ) {
        nodeFacade.deleteNode(userId, projectId, nodeId);
        return CommonResponse.ok(NodeSuccessCode.DELETE_NODE);
    }

    @Override
    @GetMapping("/nodes/list")
    public CommonResponse<GetNodeListResponse> getNodeList(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "LATEST") NodeSortType sort
    ) {
        return CommonResponse.ok(NodeSuccessCode.GET_NODE_LIST, nodeFacade.getNodeList(userId, projectId, sort));
    }

    @Override
    @GetMapping("/nodes/kanban")
    public CommonResponse<GetKanbanResponse> getKanban(
            @UserId Long userId,
            @PathVariable Long projectId
    ) {
        return CommonResponse.ok(NodeSuccessCode.GET_KANBAN, nodeFacade.getKanban(userId, projectId));
    }

    @Override
    @PatchMapping("/nodes/{nodeId}/kanban")
    public CommonResponse<?> updateNodeKanban(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeKanbanRequest request
    ) {
        nodeFacade.updateNodeKanban(userId, projectId, nodeId, request);
        return CommonResponse.ok(NodeSuccessCode.UPDATE_NODE_KANBAN);
    }

    @Override
    @PatchMapping("/nodes/{nodeId}/status")
    public CommonResponse<?> updateNodeStatus(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeStatusRequest request
    ) {
        nodeFacade.updateNodeStatus(userId, projectId, nodeId, request);
        return CommonResponse.ok(NodeSuccessCode.UPDATE_NODE_STATUS);
    }

    @Override
    @GetMapping("/nodes/{nodeId}/linked-nodes")
    public CommonResponse<GetLinkedNodesResponse> getLinkedNodes(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId
    ) {
        return CommonResponse.ok(
                NodeSuccessCode.GET_LINKED_NODES,
                nodeFacade.getLinkedNodes(userId, projectId, nodeId)
        );
    }

    @Override
    @GetMapping("/search")
    public CommonResponse<SearchNodeResponse> search(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestParam String query
    ) {
        return CommonResponse.ok(NodeSuccessCode.SEARCH, nodeFacade.search(userId, projectId, query));
    }
}
