package kr.flowmeet.api.node.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.node.dto.request.CreateEdgeRequest;
import kr.flowmeet.api.node.dto.request.UpdateEdgeRequest;
import kr.flowmeet.api.node.facade.EdgeFacade;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/projects/{projectId}/edges")
@RequiredArgsConstructor
public class EdgeController implements EdgeApi {

    private final EdgeFacade edgeFacade;

    @Override
    @PostMapping
    public CommonResponse<?> createEdge(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateEdgeRequest request
    ) {
        edgeFacade.createEdge(userId, projectId, request);
        return CommonResponse.ok();
    }

    @Override
    @DeleteMapping("/{edgeId}")
    public CommonResponse<?> deleteEdge(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long edgeId
    ) {
        edgeFacade.deleteEdge(userId, projectId, edgeId);
        return CommonResponse.ok();
    }
}
