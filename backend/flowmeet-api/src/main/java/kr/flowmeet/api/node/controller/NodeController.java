package kr.flowmeet.api.node.controller;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.node.dto.request.CreateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeRequest;
import kr.flowmeet.api.node.dto.request.UpdateNodeStatusRequest;
import kr.flowmeet.api.node.dto.response.GetFlowchartResponse;
import kr.flowmeet.api.node.dto.response.GetKanbanResponse;
import kr.flowmeet.api.node.dto.response.GetNodeListResponse;
import kr.flowmeet.api.node.dto.response.GetNodeResponse;
import kr.flowmeet.api.node.dto.response.SearchNodeResponse;
import kr.flowmeet.api.node.facade.NodeFacade;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.node.entity.NodeStatus;

@RestController
@RequestMapping("/v1/projects/{projectId}")
@RequiredArgsConstructor
public class NodeController implements NodeApi {

    private final NodeFacade nodeFacade;

    @Override
    @GetMapping("/nodes")
    public CommonResponse<GetFlowchartResponse> getFlowchart(@UserId Long userId, @PathVariable Long projectId) {
        return CommonResponse.ok(nodeFacade.getFlowchart(userId, projectId));
    }

    @Override
    @GetMapping("/nodes/{nodeId}")
    public CommonResponse<GetNodeResponse> getNode(@UserId Long userId, @PathVariable Long projectId,
                                                   @PathVariable Long nodeId) {
        return CommonResponse.ok(nodeFacade.getNode(userId, projectId, nodeId));
    }

    @Override
    @PostMapping("/nodes")
    public CommonResponse<?> createNode(@UserId Long userId, @PathVariable Long projectId,
                                        @Valid @RequestBody CreateNodeRequest request) {
        nodeFacade.createNode(userId, projectId, request);
        return CommonResponse.ok();
    }

    @Override
    @PatchMapping("/nodes/{nodeId}")
    public CommonResponse<?> updateNode(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeRequest request
    ) {
        nodeFacade.updateNode(userId, projectId, nodeId, request);
        return CommonResponse.ok();
    }

    @Override
    @DeleteMapping("/nodes/{nodeId}")
    public CommonResponse<?> deleteNode(@UserId Long userId,
                                        @PathVariable Long projectId,
                                        @PathVariable Long nodeId) {
        nodeFacade.deleteNode(userId, projectId, nodeId);
        return CommonResponse.ok();
    }

    @Override
    @GetMapping("/nodes/list")
    public CommonResponse<GetNodeListResponse> getNodeList(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestParam(required = false) String sort
    ) {
        return CommonResponse.ok(
                nodeFacade.getNodeList(userId, projectId, sort));
    }

    @Override
    @GetMapping("/nodes/kanban")
    public CommonResponse<GetKanbanResponse> getKanban(@UserId Long userId,
                                                       @PathVariable Long projectId) {
        return CommonResponse.ok(nodeFacade.getKanban(userId, projectId));
    }

    @Override
    @PatchMapping("/nodes/{nodeId}/status")
    public CommonResponse<?> updateNodeStatus(@UserId Long userId,
                                              @PathVariable Long projectId,
                                              @PathVariable Long nodeId,
                                              @Valid @RequestBody UpdateNodeStatusRequest request) {
        nodeFacade.updateNodeStatus(userId, projectId, nodeId, request);
        return CommonResponse.ok();
    }

    @Override
    @GetMapping("/search")
    public CommonResponse<SearchNodeResponse> search(@UserId Long userId,
                                                     @PathVariable Long projectId,
                                                     @RequestParam String query) {
        return CommonResponse.ok(nodeFacade.search(userId, projectId, query));
    }
}
