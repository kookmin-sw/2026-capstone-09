package kr.flowmeet.api.node.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.node.dto.request.CreateEdgeRequest;
import kr.flowmeet.api.node.dto.response.GetEdgesResponse;
import kr.flowmeet.api.node.facade.EdgeFacade;
import kr.flowmeet.api.node.success.EdgeSuccessCode;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/projects/{projectId}/edges")
@RequiredArgsConstructor
public class EdgeController implements EdgeApi {

    private final EdgeFacade edgeFacade;

    @Override
    @GetMapping
    public CommonResponse<GetEdgesResponse> getEdges(
            @UserId Long userId,
            @PathVariable Long projectId
    ) {
        return CommonResponse.ok(EdgeSuccessCode.GET_EDGES, edgeFacade.getEdges(userId, projectId));
    }

    @Override
    @PostMapping
    public CommonResponse<?> createEdge(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateEdgeRequest request
    ) {
        edgeFacade.createEdge(userId, projectId, request);
        return CommonResponse.ok(EdgeSuccessCode.CREATE_EDGE);
    }

    @Override
    @DeleteMapping("/{edgeId}")
    public CommonResponse<?> deleteEdge(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long edgeId
    ) {
        edgeFacade.deleteEdge(userId, projectId, edgeId);
        return CommonResponse.ok(EdgeSuccessCode.DELETE_EDGE);
    }
}
